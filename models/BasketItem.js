import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BasketItem = sequelize.define('BasketItem', {
  basket_item_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  basket_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'baskets',
      key: 'basket_id'
    },
    allowNull: false,
  },
  product: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'basket_items',
  timestamps: true,
});

export default BasketItem;