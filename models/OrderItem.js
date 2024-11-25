import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.STRING,
    references: {
      model: 'orders',
      key: 'order_id'
    },
    allowNull: false,
  },
  product_data: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'order_items',
  timestamps: true,
}); 

export default OrderItem;