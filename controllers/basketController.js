import db from '../models/index.js';

// Get user Basket (authenticated)
export const getUserBasket = async (req, res) => {
  try {
    const userId = req.user.id;
    const basket = await db.Basket.findOne({
      where: { user_id: userId, status: 'active' },
      include: [{ model: db.BasketItem }],
    });

    if (!basket) {
      return res.status(404).json({ message: 'No active basket found' });
    }

    res.json(basket);
  } catch (error) {
    console.error('Error in getUserBasket:', error);
    res.status(500).json({ message: 'Error fetching basket' });
  }
};

// Sync Basket with user account (authenticated)
export const createUserBasket = async (req, res) => {
  try {
    console.log('userId', req.user)
    const userId = req.user.id;
    const guestBasketItems = req.body; // Assumes an array of basket items

    let basket = await db.Basket.findOne({
      where: { user_id: userId, status: 'active' },
    });

    if (!basket) {
      basket = await db.Basket.create({ user_id: userId, status: 'active' });
    }

    // Add guest items to the user's basket
    for (const item of guestBasketItems) {
      await db.BasketItem.create({
        basket_id: basket.basket_id,
        product: item.product,
        quantity: item.quantity,
      });
    }

    // Fetch the updated basket with items
    const updatedBasket = await db.Basket.findOne({
      where: { basket_id: basket.basket_id },
      include: [{ model: db.BasketItem }],
    });

    res.status(201).json(updatedBasket);
  } catch (error) {
    console.error('Error in createUserBasket:', error);
    res.status(500).json({ message: 'Error syncing basket' });
  }
};

// Add item to Basket (authenticated or guest)
export const addItemToBasket = async (req, res) => {
  console.log('Adding item to basket:', req.body);
  try {
    const { product, quantity } = req.body;
    let basket;

    if (req.user) {
      // Authenticated user
      basket = await db.Basket.findOne({
        where: { id: req.user.id, status: 'active' },
      });

      if (!basket) {
        basket = await db.Basket.create({ id: req.user.id, status: 'active' });
      }
    } else {
      // Guest user
      basket = await db.Basket.create({ status: 'active' });
    }

    const basketItem = await db.BasketItem.create({
      basket_id: basket.id,
      product,
      quantity,
    });

    res.status(201).json(basketItem);
  } catch (error) {
    console.error('Error in addItemToBasket:', error);
    res.status(500).json({ message: 'Error adding item to basket' });
  }
};

// Update item quantity in Basket (authenticated or guest)
export const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const basketItem = await db.BasketItem.findByPk(id);

    if (!basketItem) {
      return res.status(404).json({ message: 'Basket item not found' });
    }

    // If authenticated, ensure the basket belongs to the user
    if (req.user) {
      const basket = await db.Basket.findByPk(basketItem.basket_id);
      if (basket.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this basket' });
      }
    }

    await basketItem.update({ quantity });

    res.json(basketItem);
  } catch (error) {
    console.error('Error in updateItemQuantity:', error);
    res.status(500).json({ message: 'Error updating item quantity' });
  }
};

// Remove item from Basket (authenticated or guest)
export const removeItemFromBasket = async (req, res) => {
  try {
    const { id } = req.params;

    const basketItem = await db.BasketItem.findByPk(id);

    if (!basketItem) {
      return res.status(404).json({ message: 'Basket item not found' });
    }

    // If authenticated, ensure the basket belongs to the user
    if (req.user) {
      const basket = await db.Basket.findByPk(basketItem.basket_id);
      if (basket.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to remove this item' });
      }
    }

    await basketItem.destroy();

    res.json({ message: 'Item removed from basket' });
  } catch (error) {
    console.error('Error in removeItemFromBasket:', error);
    res.status(500).json({ message: 'Error removing item from basket' });
  }
};

// Clear Basket (authenticated)
export const clearBasket = async (req, res) => {
  try {
    const userId = req.user.id;

    const basket = await db.Basket.findOne({
      where: { user_id: userId, status: 'active' },
    });

    if (!basket) {
      return res.status(404).json({ message: 'No active basket found' });
    }

    await db.BasketItem.destroy({
      where: { basket_id: basket.basket_id },
    });

    res.json({ message: 'Basket cleared successfully' });
  } catch (error) {
    console.error('Error in clearBasket:', error);
    res.status(500).json({ message: 'Error clearing basket' });
  }
};