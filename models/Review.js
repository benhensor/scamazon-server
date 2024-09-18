import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'products',
      key: 'product_id'
    },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'user_id'
    },
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'reviews',
  timestamps: true,
});

export default Review;