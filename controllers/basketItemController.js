import db from '../models/index.js';
import { addItemToBasket } from '../controllers/basketController.js'

export async function getBasketItems(req, res) {
	try {
		let userId = req.user?.id || null
		let basketId = req.cookies.guest_basket_id

		if (!userId && !basketId) {
			return res.status(200).json({ items: [] })
		}

		const basket = await db.Basket.findOne({
			where: userId ? { user_id: userId } : { cart_id: basketId },
			include: [
				{
					model: BasketItem,
					as: 'items',
				},
			],
		})

		if (!basket) {
			return res.status(200).json({ message: 'No basket found', items: [] })
		}

		res.status(200).json(basket.items)
	} catch (error) {
		console.error('Error in getBasketItems:', error)
		res.status(500).json({ error: 'Failed to fetch basket items' })
	}
}

export async function addBasketItem(req, res) {
	return addItemToBasket(req, res)
}

export async function updateBasketItemQuantity(req, res) {
	try {
		const { id } = req.params
		const { quantity } = req.body
		let userId = req.user?.id || null
		let basketId = req.cookies.guest_basket_id

    if (typeof quantity !== 'number' || quantity < 0) {
			return res.status(400).json({ error: 'Invalid quantity' })
		}

		if (!userId && !basketId) {
			return res.status(400).json({ error: 'No basket found' })
		}

		const basket = await Basket.findOne({
			where: userId ? { user_id: userId } : { cart_id: basketId },
		})

		if (!basket) {
			return res.status(404).json({ error: 'Basket not found' })
		}

		const basketItem = await db.BasketItem.findOne({
			where: {
				cart_item_id: id,
				cart_id: basket.cart_id,
			},
		})

		if (!basketItem) {
			return res.status(404).json({ error: 'Basket item not found' })
		}

		if (quantity <= 0) {
			await basketItem.destroy()
			return res.status(204).send()
		}

		await basketItem.update({ quantity })
		res.status(200).json({ message: 'Item quantity updated', item: basketItem })
	} catch (error) {
		console.error('Error in updateBasketItemQuantity:', error)
		res.status(500).json({ error: 'Failed to update basket item quantity' })
	}
}

export async function removeBasketItem(req, res) {
	try {
		const { id } = req.params
		let userId = req.user?.id || null
		let basketId = req.cookies.guest_basket_id

		if (!userId && !basketId) {
			return res.status(400).json({ error: 'No basket found' })
		}

		const basket = await db.Basket.findOne({
			where: userId ? { user_id: userId } : { cart_id: basketId },
		})

		if (!basket) {
			return res.status(404).json({ error: 'Basket not found' })
		}

		const deleted = await BasketItem.destroy({
			where: {
				cart_item_id: id,
				cart_id: basket.cart_id,
			},
		})

		if (deleted) {
			return res.status(204).send() 
		} else {
			res.status(404).json({ error: 'Item not found in basket' })
		}
	} catch (error) {
		console.error('Error in removeBasketItem:', error)
		res.status(500).json({ error: 'Failed to remove basket item' })
	}
}
