import express from 'express'
const router = express.Router()
import {
	getAllProducts,
	getProductCategories,
	getProductsByCategory,
	getProductCategoryList,
	getProductById,
	searchProducts,
	sortProducts,

} from '../controllers/productsController.js'

// Get all products (with optional filters)
router.get('/', getAllProducts)

// Get single product by ID
router.get('/:id', getProductById)

// Search products
router.get('/search', searchProducts)

// Sort products
router.get('/sort/sort', sortProducts)

// Get product categories
router.get('/categories', getProductCategories)

// Get product categories list
router.get('/category-list', getProductCategoryList)

// Get product by category
router.get('/category/:category', getProductsByCategory)

export default router
