import sequelize from '../config/database.js'
import User from './User.js'
import Address from './Address.js'
import Order from './Order.js'
import OrderItem from './OrderItem.js'
import Basket from './Basket.js'
import BasketItem from './BasketItem.js'
import PaymentMethod from './PaymentMethod.js'

// Define Relationships

// Users and Addresses
User.hasMany(Address, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Address.belongsTo(User, { foreignKey: 'user_id' })

// Users and Orders
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Order.belongsTo(User, { foreignKey: 'user_id' })

// Users and Cart
User.hasOne(Basket, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Basket.belongsTo(User, { foreignKey: 'user_id' })

// Orders and Order Items
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'order_items', onDelete: 'CASCADE' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })

// Carts and Cart Items
Basket.hasMany(BasketItem, { foreignKey: 'basket_id', onDelete: 'CASCADE' })
BasketItem.belongsTo(Basket, { foreignKey: 'basket_id' }) 


const db = {
	sequelize,
	User,
	Address,
	Order,
	OrderItem,
	Basket,
	BasketItem,
	PaymentMethod,
}

export default db
