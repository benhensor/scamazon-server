import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'user_id',
    },
    allowNull: true, // This can be null if the review is from a guest
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reviewer_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reviewer_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'reviews',
  timestamps: true, 
});

export default Review;
