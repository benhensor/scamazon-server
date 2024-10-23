import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Profile = sequelize.define('Profile', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING(255),
  },
  browsing_history: {
    type: DataTypes.ARRAY(DataTypes.BIGINT),
  },
}, {
  tableName: 'profiles',
  timestamps: true,
});