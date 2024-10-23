import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Address = sequelize.define(
	'Address',
	{
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
		full_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		phone_number: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		address_line1: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		address_line2: {
			type: DataTypes.STRING(255),
		},
		city: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		county: {
			type: DataTypes.STRING(50),
		},
		postcode: {
			type: DataTypes.STRING(10),
			allowNull: false,
			validate: {
				is: /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/,
				len: [6, 8],
			},
		},
		country: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		is_default: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		is_billing: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		delivery_instructions: {
			type: DataTypes.TEXT,
		},
		address_type: {
			type: DataTypes.ENUM('home', 'work', 'other'),
			defaultValue: 'home',
		},
	},
	{
		tableName: 'addresses',
		timestamps: true,
	}
)

export default Address;
