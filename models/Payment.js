import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'orders',
      key: 'order_id'
    },
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'pending',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

export default Payment;