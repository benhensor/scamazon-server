import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users', // 'users' refers to table name
      key: 'user_id'
    },
    allowNull: false
  },
  order_placed: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  shipping: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }  
}, {
  tableName: 'orders',
  timestamps: true,
});

export default Order;