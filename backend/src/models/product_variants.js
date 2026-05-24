const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_variants', {
    variantId: {
      field: 'variant_id',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    productId: {
      field: 'product_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    skuVariant: {
      field: 'sku_variant',
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "sku_variant"
    },
    colorName: {
      field: 'color_name',
      type: DataTypes.STRING(100),
      allowNull: true
    },
    colorCode: {
      field: 'color_code',
      type: DataTypes.STRING(30),
      allowNull: true
    },
    colorImage: {
      field: 'color_image',
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sizeName: {
      field: 'size_name',
      type: DataTypes.STRING(20),
      allowNull: true
    },
    stockQuantity: {
      field: 'stock_quantity',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    priceAdjustment: {
      field: 'price_adjustment',
      type: DataTypes.DECIMAL(19,2),
      allowNull: true,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'product_variants',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "variant_id" },
        ]
      },
      {
        name: "sku_variant",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sku_variant" },
        ]
      },
      {
        name: "fk_1",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "idx_variant_sku",
        using: "BTREE",
        fields: [
          { name: "sku_variant" },
        ]
      },
    ]
  });
};
