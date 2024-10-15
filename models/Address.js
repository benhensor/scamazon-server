import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Address = sequelize.define('Address', {
  // Model attributes are defined here
  address_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'user_id',
    },
    allowNull: false,
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
  tableName: 'addresses',
  timestamps: true,
});

export default Address;