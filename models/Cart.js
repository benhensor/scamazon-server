import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Cart = sequelize.define('Cart', {
  cart_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'user_id'
    },
    allowNull: false,
  },
}, {
  tableName: 'carts',
  timestamps: true,
});

export default Cart;