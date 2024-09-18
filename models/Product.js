import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Product = sequelize.define(
  'Product',
  {
    product_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255), // Specify a max length for product titles
      allowNull: false,
      validate: {
        len: [1, 255], // Product title must be between 1 and 255 characters
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01 // Ensure price is positive and non-zero
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50), // Limit category length for consistency
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255), // Ensure URLs don’t exceed 255 chars
      allowNull: false,
    },
    rating_rate: {
      type: DataTypes.FLOAT, // Rating from the API
      validate: {
        min: 0,
        max: 5 // Assuming ratings are out of 5
      }
    },
    rating_count: {
      type: DataTypes.INTEGER, // Number of ratings from the API
      validate: {
        min: 0 // Ensure count can't be negative
      }
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Manage stock locally, starting at 0
      validate: {
        min: 0 // Ensure stock isn't negative
      }
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    tableName: 'products',
  }
);

export default Product;