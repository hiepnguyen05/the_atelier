const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coupons', {
    couponId: {
      field: 'coupon_id',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "code"
    },
    discountPercent: {
      field: 'discount_percent',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discountAmount: {
      field: 'discount_amount',
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    minOrderValue: {
      field: 'min_order_value',
      type: DataTypes.DECIMAL(19,2),
      allowNull: true
    },
    expiryDate: {
      field: 'expiry_date',
      type: DataTypes.DATE,
      allowNull: true
    },
    usageLimit: {
      field: 'usage_limit',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    isActive: {
      field: 'is_active',
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'coupons',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "coupon_id" },
        ]
      },
      {
        name: "code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
};
