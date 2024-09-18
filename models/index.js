import sequelize from '../config/database.js'
import User from './User.js'
import Order from './Order.js'
import OrderItem from './OrderItem.js'
import Cart from './Cart.js'
import CartItem from './CartItem.js'
import Payment from './Payment.js'
import Review from './Review.js'

// Define Relationships

// 1. Users and Orders
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Order.belongsTo(User, { foreignKey: 'user_id' })

// 2. Users and Reviews
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Review.belongsTo(User, { foreignKey: 'user_id' })

// 3. Users and Cart
User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' })
Cart.belongsTo(User, { foreignKey: 'user_id' })

// 4. Orders and Order Items
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })

// 5. Orders and Payment
Order.hasOne(Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' })
Payment.belongsTo(Order, { foreignKey: 'order_id' })

// 6. Carts and Cart Items
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' })
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' })

// Synchronize models with the database in bulk
const syncModels = async () => {
	try {
		await sequelize.sync({ force: true }) // Use { force: true } if you need to reset tables completely
		console.log('All models were synchronized successfully.')
	} catch (error) {
		console.error('Error synchronizing models:', error)
	}
}

syncModels()

const db = {
	sequelize,
	User,
	Order,
	OrderItem,
	Cart,
	CartItem,
	Payment,
	Review,
}

export default db
