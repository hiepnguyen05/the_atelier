const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    order_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "order_code"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'coupons',
        key: 'coupon_id'
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true,
      defaultValue: 0.00
    },
    final_amount: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    shipping_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'addresses',
        key: 'address_id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending','processing','shipped','completed','cancelled'),
      allowNull: true,
      defaultValue: "pending"
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'orders',
    timestamps: false,
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
