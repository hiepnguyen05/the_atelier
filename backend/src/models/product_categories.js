const { DataTypes } = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define("product_categories", {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'products',
        key: 'product_id'
      },
      field: 'product_id'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categories',
        key: 'category_id'
      },
      field: 'category_id'
    }
  }, {
    sequelize,
    tableName: "product_categories",
    timestamps: true,
    paranoid: false, // Tắt xóa mềm đối với bảng trung gian để tránh lỗi trùng khóa chính khi cập nhật liên kết
    underscored: true,
  });
};
