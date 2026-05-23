const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    productId: {
      field: 'product_id',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    skuBase: {
      field: 'sku_base',
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "sku_base"
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "slug"
    },
    brandId: {
      field: 'brand_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'brand_id'
      }
    },
    categoryId: {
      field: 'category_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'category_id'
      }
    },
    productType: {
      field: 'product_type',
      type: DataTypes.ENUM('clothing_top', 'clothing_bottom', 'shoes', 'slippers', 'eyewear', 'bag', 'perfume'),
      allowNull: false,
      defaultValue: 'clothing_top'
    },
    gender: {
      type: DataTypes.ENUM('nam', 'nu', 'unisex'),
      allowNull: false,
      defaultValue: 'unisex'
    },
    basePrice: {
      field: 'base_price',
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    material: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    careInstructions: {
      field: 'care_instructions',
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active','inactive','archived'),
      allowNull: true,
      defaultValue: "active"
    },
    specifications: {
      field: 'specifications',
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "sku_base",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sku_base" },
        ]
      },
      {
        name: "slug",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
      {
        name: "fk_1",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "idx_product_type",
        using: "BTREE",
        fields: [
          { name: "product_type" },
        ]
      },
      {
        name: "idx_product_slug",
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
      {
        name: "idx_product_sku",
        using: "BTREE",
        fields: [
          { name: "sku_base" },
        ]
      },
    ]
  });
};
