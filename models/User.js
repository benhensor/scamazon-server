import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  // Model attributes are defined here
  user_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address_line1: {
    type: DataTypes.STRING(255),
  },
  address_line2: {
    type: DataTypes.STRING(255),
  },
  city: {
    type: DataTypes.STRING(50),
  },
  county: {
    type: DataTypes.STRING(50),
  },
  postcode: {
    type: DataTypes.STRING(10),
    validate: {
      is: /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/,
      len: [6, 8],
    }
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;