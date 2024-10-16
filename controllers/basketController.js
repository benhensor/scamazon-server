import db from '../models/index.js';

// Get user Basket (authenticated)
export const getUserBasket = async (req, res) => {
  try {
    const userId = req.user.user_id;
    let basket = await db.Basket.findOne({ where: { user_id: userId, status: 'active' } });

    if (!basket) {
      basket = await db.Basket.create({ user_id: userId, status: 'active' });
    }

    const basketItems = await db.BasketItem.findAll({ where: { basket_id: basket.basket_id } });
    const total = basketItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    res.status(200).json({ basket, basketItems, total });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user basket', error: error.message });
  }
}

export const addItemToBasket = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { product, quantity } = req.body;

    let basket;
    if (userId) {
      basket = await db.Basket.findOne({ where: { user_id: userId, status: 'active' } });
      if (!basket) {
        basket = await db.Basket.create({ user_id: userId, status: 'active' });
      }
    } else {
      // For guest users, we'll just return the product as is
      return res.json({ ...product, quantity });
    }

    let basketItem = await db.BasketItem.findOne({
      where: { basket_id: basket.basket_id, 'product.id': product.id }
    });

    if (basketItem) {
      basketItem.quantity += quantity;
      await basketItem.save();
    } else {
      basketItem = await db.BasketItem.create({
        basket_id: basket.basket_id,
        product,
        quantity
      });
    }

    res.json(basketItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to basket', error: error.message });
  }
};

export const removeItemFromBasket = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { productId } = req.body;

    if (userId) {
      const basket = await db.Basket.findOne({ where: { user_id: userId, status: 'active' } });
      if (basket) {
        await BasketItem.destroy({
          where: { basket_id: basket.basket_id, 'product.id': productId }
        });
      }
    }

    res.json({ message: 'Item removed from basket' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from basket', error: error.message });
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { id } = req.params;
    const { quantity } = req.body;

    if (userId) {
      const basket = await db.Basket.findOne({ where: { user_id: userId, status: 'active' } });
      if (basket) {
        const basketItem = await db.BasketItem.findOne({
          where: { basket_id: basket.basket_id, 'product.id': id }
        });

        if (basketItem) {
          basketItem.quantity = quantity;
          await basketItem.save();
          return res.json(basketItem);
        }
      }
    }

    res.json({ id, quantity });
  } catch (error) {
    res.status(500).json({ message: 'Error updating basket item quantity', error: error.message });
  }
};

export const clearBasket = async (req, res) => {
  try {
    const userId = req.user.id;
    const basket = await db.Basket.findOne({ where: { user_id: userId, status: 'active' } });

    if (basket) {
      await BasketItem.destroy({ where: { basket_id: basket.basket_id } });
    }

    res.json({ message: 'Basket cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing basket', error: error.message });
  }
};