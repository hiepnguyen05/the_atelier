const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payments', {
    paymentId: {
      field: 'payment_id',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderId: {
      field: 'order_id',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'order_id'
      },
      unique: "order_id"
    },
    paymentMethod: {
      field: 'payment_method',
      type: DataTypes.ENUM('credit_card','bank_transfer','cod','e_wallet'),
      allowNull: false
    },
    transactionId: {
      field: 'transaction_id',
      type: DataTypes.STRING(100),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(19,2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','completed','failed','refunded','refund_pending'),
      allowNull: true,
      defaultValue: "pending"
    },
    paymentDate: {
      field: 'payment_date',
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "payment_id" },
        ]
      },
      {
        name: "order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
};
