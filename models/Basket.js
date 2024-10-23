import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Basket = sequelize.define(
	'Basket',
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
			allowNull: true,
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
