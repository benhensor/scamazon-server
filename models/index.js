import sequelize from '../config/database.js'
import User from './User'
import Product from './Product'
import Category from './Category'
import Order from './Order'
import OrderItem from './OrderItem'
import Cart from './Cart'
import CartItem from './CartItem'
import Payment from './Payment'
import Review from './Review'

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

// 5. Products and Order Items
Product.hasMany(OrderItem, { foreignKey: 'product_id' })
OrderItem.belongsTo(Product, { foreignKey: 'product_id' })

// 6. Products and Reviews
Product.hasMany(Review, { foreignKey: 'product_id', onDelete: 'CASCADE' })
Review.belongsTo(Product, { foreignKey: 'product_id' })

// 7. Products and Cart Items
Product.hasMany(CartItem, { foreignKey: 'product_id' })
CartItem.belongsTo(Product, { foreignKey: 'product_id' })

// 8. Orders and Payment
Order.hasOne(Payment, { foreignKey: 'order_id', onDelete: 'CASCADE' })
Payment.belongsTo(Order, { foreignKey: 'order_id' })

// 9. Categories and Products
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'SET NULL' })
Product.belongsTo(Category, { foreignKey: 'category_id' })

// 10. Carts and Cart Items
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' })
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' })

// Synchronize models with the database in bulk
const syncModels = async () => {
	try {
		await sequelize.sync({ alter: true }) // Use { force: true } if you need to reset tables completely
		console.log('All models were synchronized successfully.')
	} catch (error) {
		console.error('Error synchronizing models:', error)
	}
}

syncModels()

const db = {
	sequelize,
	User,
	Product,
	Category,
	Order,
	OrderItem,
	Cart,
	CartItem,
	Payment,
	Review,
}

export default db
