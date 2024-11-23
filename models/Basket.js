import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Basket = sequelize.define(
	'Basket',
	{
		basket_id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.BIGINT,
			references: {
				model: 'users',
				key: 'user_id',
			},
			allowNull: true,
		},
		items: {
			type: DataTypes.ARRAY(DataTypes.JSONB),
			defaultValue: [],
			allowNull: false,
		},
		count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		total: {
			type: DataTypes.DECIMAL(10, 2),
			defaultValue: 0.0,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(
				'active',
				'saved_for_later',
				'converted_to_order'
			),
			defaultValue: 'active', 
			allowNull: false,
		},
		last_modified: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
		},
	},
	{
		tableName: 'baskets',
		timestamps: true,
	}
) 

export default Basket
