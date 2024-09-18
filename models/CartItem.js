import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CartItem = sequelize.define('CartItem', {
  cart_item_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  cart_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'carts',
      key: 'cart_id'
    },
    allowNull: false,
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'cart_items',
  timestamps: true,
});

export default CartItem;