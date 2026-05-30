const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    orderId: {
      field: 'order_id',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderCode: {
      field: 'order_code',
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "order_code"
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    couponId: {
      field: 'coupon_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'coupons',
        key: 'coupon_id'
      }
    },
    totalAmount: {
      field: 'total_amount',
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    shippingFee: {
      field: 'shipping_fee',
      type: DataTypes.DECIMAL(19,2),
      allowNull: true,
      defaultValue: 0.00
    },
    finalAmount: {
      field: 'final_amount',
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    shippingAddressId: {
      field: 'shipping_address_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'addresses',
        key: 'address_id'
      }
    },
    paymentMethod: {
      field: 'payment_method',
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "COD"
    },
    status: {
      type: DataTypes.ENUM('pending','processing','shipped','completed','cancelled'),
      allowNull: true,
      defaultValue: "pending"
    },
    cancelReason: {
      field: 'cancel_reason',
      type: DataTypes.TEXT,
      allowNull: true
    },
    refundBankName: {
      field: 'refund_bank_name',
      type: DataTypes.STRING(100),
      allowNull: true
    },
    refundAccountNumber: {
      field: 'refund_account_number',
      type: DataTypes.STRING(50),
      allowNull: true
    },
    refundAccountName: {
      field: 'refund_account_name',
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "order_code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_code" },
        ]
      },
      {
        name: "fk_1",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "fk_2",
        using: "BTREE",
        fields: [
          { name: "coupon_id" },
        ]
      },
      {
        name: "fk_3",
        using: "BTREE",
        fields: [
          { name: "shipping_address_id" },
        ]
      },
      {
        name: "idx_order_code",
        using: "BTREE",
        fields: [
          { name: "order_code" },
        ]
      },
    ]
  });
};
