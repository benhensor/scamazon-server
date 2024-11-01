import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users', // 'users' refers to table name
      key: 'id'
    },
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending', // Default order status
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.TEXT, // You can store the address as a JSON or TEXT field
    allowNull: false,
  },
  billing_address: {
    type: DataTypes.TEXT, // You can store the address as a JSON or TEXT field
    allowNull: false,
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

export default Order;