import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Category = sequelize.define("Category", {
  category_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "categories",
  timestamps: true,
});

export default Category;