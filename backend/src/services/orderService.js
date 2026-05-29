const { models, sequelize } = require("../config/db");
const { Op } = require("sequelize");

// Helper to generate a unique order code
const generateOrderCode = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Create a new order
 */
const createOrder = async (userId, data) => {
  const { items, shippingAddress, couponId, paymentMethod } = data;

  if (!items || items.length === 0) {
    throw new Error("No order items");
  }

  const transaction = await sequelize.transaction();
  try {
    let addressIdToUse = null;
    if (shippingAddress) {
      const newAddress = await models.addresses.create({
        userId,
        recipientName: shippingAddress.recipientName,
        phoneNumber: shippingAddress.phoneNumber,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city
      }, { transaction });
      addressIdToUse = newAddress.addressId;
    }

    let totalAmount = 0;
    const orderItemsData = [];
    const variantIdsToUpdate = [];

    // 1. Verify items and calculate total amount
    for (const item of items) {
      const variant = await models.product_variants.findByPk(item.variantId, { transaction });
      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }

      let actualPrice = variant.price;
      if (!actualPrice) {
          const product = await models.products.findByPk(variant.productId, { transaction });
          actualPrice = product.basePrice;
      }

      const itemTotal = Number(actualPrice) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtTime: actualPrice
      });
      variantIdsToUpdate.push(item.variantId);
    }

    // 2. Calculate shipping and final amount
    const shippingFee = 0; // Free shipping as requested
    let finalAmount = totalAmount + shippingFee;

    // 3. Create the order
    const order = await models.orders.create({
      orderCode: generateOrderCode(),
      userId,
      couponId: couponId || null,
      totalAmount,
      shippingFee,
      finalAmount,
      shippingAddressId: addressIdToUse,
      paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    }, { transaction });

    // 4. Create order items
    const orderItemsToCreate = orderItemsData.map(item => ({
      orderId: order.orderId,
      ...item
    }));
    await models.order_items.bulkCreate(orderItemsToCreate, { transaction });

    // 5. Remove purchased items from the user's cart
    const cart = await models.cart.findOne({ where: { userId }, transaction });
    if (cart) {
      await models.cart_items.destroy({
        where: {
          cartId: cart.cartId,
          variantId: {
            [require('sequelize').Op.in]: variantIdsToUpdate
          }
        },
        transaction,
        force: true
      });
    }

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get user orders
 */
const getUserOrders = async (userId) => {
  return await models.orders.findAll({
    where: { userId },
    include: [
      {
        model: models.order_items,
        as: 'orderItems',
        include: [
          {
            model: models.product_variants,
            as: 'variant',
            include: [
              {
                model: models.products,
                as: 'product',
                attributes: ['productId', 'name', 'slug'],
                include: [
                  {
                    model: models.product_images,
                    as: 'productImages',
                    attributes: ['imageUrl', 'isPrimary']
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Get order by ID
 */
const getOrderById = async (orderId, userId, userRole) => {
  const order = await models.orders.findByPk(orderId, {
    include: [
      {
        model: models.addresses,
        as: 'shippingAddress',
        attributes: ['recipientName', 'phoneNumber', 'addressLine', 'city']
      },
      {
        model: models.order_items,
        as: 'orderItems',
        include: [
          {
            model: models.product_variants,
            as: 'variant',
            include: [
              {
                model: models.products,
                as: 'product',
                attributes: ['productId', 'name', 'slug'],
                include: [
                  {
                    model: models.product_images,
                    as: 'productImages',
                    attributes: ['imageUrl', 'isPrimary']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== userId && userRole !== 'admin') {
    throw new Error("Not authorized to view this order");
  }

  return order;
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const order = await models.orders.findByPk(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();
  return order;
};

/**
 * Get all orders for Admin with pagination, filtering, and search
 */
const getAllOrders = async (query) => {
  const { page = 1, limit = 10, status, search } = query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }

  const userIncludeClause = {
    model: models.users,
    as: 'user',
    attributes: ['userId', 'fullName', 'email', 'phone']
  };

  if (search) {
    whereClause[Op.or] = [
      { orderCode: { [Op.like]: `%${search}%` } },
      { '$user.full_name$': { [Op.like]: `%${search}%` } },
      { '$user.email$': { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows } = await models.orders.findAndCountAll({
    where: whereClause,
    include: [
      userIncludeClause,
      {
        model: models.addresses,
        as: 'shippingAddress',
        attributes: ['recipientName', 'phoneNumber', 'addressLine', 'city']
      },
      {
        model: models.order_items,
        as: 'orderItems',
        include: [
          {
            model: models.product_variants,
            as: 'variant',
            include: [
              {
                model: models.products,
                as: 'product',
                attributes: ['productId', 'name', 'slug'],
                include: [
                  {
                    model: models.product_images,
                    as: 'productImages'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    subQuery: false // Required when filtering by included model's attributes in where clause
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    orders: rows
  };
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};
