const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_variants', {
    variant_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    sku_variant: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "sku_variant"
    },
    color_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    color_code: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    size_name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    price_adjustment: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: true,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'product_variants',
    timestamps: false,
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
