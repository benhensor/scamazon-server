import db from '../models/index.js';

// Get user Basket (authenticated)
export const getUserBasket = async (req, res) => {
  try {
    const userId = req.user.user_id;
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
    const userId = req.user.user_id;
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
    const { productId, quantity } = req.body;
    let basket;

    if (req.user) {
      // Authenticated user
      basket = await db.Basket.findOne({
        where: { user_id: req.user.user_id, status: 'active' },
      });

      if (!basket) {
        basket = await db.Basket.create({ user_id: req.user.user_id, status: 'active' });
      }
    } else {
      // Guest user
      basket = await db.Basket.create({ status: 'active' });
    }

    // Check if the item is already in the basket
    const existingItem = await db.BasketItem.findOne({
      where: { basket_id: basket.basket_id, product_id: productId },
    });

    if (existingItem) {
      // If the item already exists, update the quantity
      await existingItem.update({ quantity: existingItem.quantity + quantity });
      return res.json(existingItem);
    }

    // Add the item to the basket

    const basketItem = await db.BasketItem.create({
      basket_id: basket.basket_id,
      product_id: productId,
      quantity,
    });

    res.status(201).json(basketItem);
  } catch (error) {
    console.error('Error in addItemToBasket:', error);
    res.status(500).json({ message: 'Error adding item to basket' });
  }
};

// Toggle item selected status in Basket (authenticated)
export const toggleItemSelected = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('basketItem', id)
    const basketItem = await db.BasketItem.findByPk(id);
    if (!basketItem) {
      return res.status(404).json({ message: 'Basket item not found' });
    }

    // Check if the user is authenticated
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Ensure the basket belongs to the user
    const basket = await db.Basket.findByPk(basketItem.basket_id);
    if (!basket || basket.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Not authorized to update this basket' });
    }

    await basketItem.update({ is_selected: !basketItem.is_selected });

    res.json(basketItem);
  } catch (error) {
    console.error('Error in toggleItemSelected:', error);
    res.status(500).json({ message: 'Error toggling item selected status' });
  }
};

// Select all items in Basket (authenticated or guest)
export const selectAllItems = async (req, res) => {
  try {

    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const basket = await db.Basket.findOne({
      where: { user_id: req.user.user_id, status: 'active' },
      include: [{ model: db.BasketItem }],
    });

    if (!basket) {
      return res.status(404).json({ message: 'No active basket found' });
    }

    await db.BasketItem.update(
      { is_selected: true },
      { where: { basket_id: basket.basket_id } }
    );

    // Fetch the updated basket with items
    const updatedBasket = await db.Basket.findOne({
      where: { basket_id: basket.basket_id },
      include: [{ model: db.BasketItem }],
    });

    res.json(updatedBasket);
  } catch (error) {
    console.error('Error in selectAllItems:', error);
    res.status(500).json({ message: 'Error selecting all items' });
  }
};

// Deselect all items in Basket (authenticated or guest)
export const deselectAllItems = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const basket = await db.Basket.findOne({
      where: { user_id: req.user.user_id, status: 'active' },
      include: [{ model: db.BasketItem }],
    });

    if (!basket) {
      return res.status(404).json({ message: 'No active basket found' });
    }

    await db.BasketItem.update(
      { is_selected: false },
      { where: { basket_id: basket.basket_id } }
    );

    // Fetch the updated basket with items
    const updatedBasket = await db.Basket.findOne({
      where: { basket_id: basket.basket_id },
      include: [{ model: db.BasketItem }],
    });

    res.json(updatedBasket);
  } catch (error) {
    console.error('Error in deselectAllItems:', error);
    res.status(500).json({ message: 'Error deselecting all items' });
  }
};

// Update item quantity in Basket (authenticated or guest)
export const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const basketItem = await db.BasketItem.findByPk(id);
    console.log('basketItem', id, quantity, basketItem)

    if (!basketItem) {
      return res.status(404).json({ message: 'Basket item not found' });
    }

    // If authenticated, ensure the basket belongs to the user
    if (req.user) {
      const basket = await db.Basket.findByPk(basketItem.basket_id);
      if (basket.user_id !== req.user.user_id) {
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
      if (basket.user_id !== req.user.user_id) {
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
    const userId = req.user.user_id;

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