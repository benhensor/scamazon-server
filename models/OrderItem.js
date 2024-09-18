import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'orders',
      key: 'order_id'
    },
    allowNull: false,
  },
  product_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'products',
      key: 'product_id'
    },
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: true,
});

export default OrderItem;