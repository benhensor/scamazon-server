import db from '../models/index.js';

export async function addItemToBasket(req, res) {
  try {
    const { product, quantity } = req.body;
    let basketId = req.cookies.basket_id;

    if (!product || typeof product !== 'object') {
      return res.status(400).json({ error: 'Valid product object is required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    let basket;
    
    // Find existing basket or create a new one
    if (basketId) {
      basket = await db.Basket.findByPk(basketId);
    }
    
    if (!basket) {
      basket = await db.Basket.create({
        status: 'active',
        user_id: req.user?.user_id || null, // Add user_id if available
      });
      
      // Set cookie for basket identification
      res.cookie('basket_id', basket.basket_id, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    // Find or create basket item
    const [basketItem, created] = await db.BasketItem.findOrCreate({
      where: {
        basket_id: basket.basket_id,
        'product.id': product.id,
      },
      defaults: {
        product,
        quantity,
      },
    });

    if (!created) {
      await basketItem.update({
        quantity: basketItem.quantity + quantity,
      });
    }

    // Update basket last_modified timestamp
    await basket.update({ last_modified: new Date() });

    return res.status(created ? 201 : 200).json({
      basketItem,
      basket_id: basket.basket_id,
    });
  } catch (error) {
    console.error('Error in addItemToBasket:', error);
    res.status(500).json({ error: 'Failed to add item to basket' });
  }
}

export async function getUserBasket(req, res) {
  try {
    const basketId = req.cookies.basket_id;
    
    if (!basketId) {
      return res.status(404).json({ error: 'No basket found' });
    }

    const basket = await db.Basket.findByPk(basketId, {
      include: [{
        model: db.BasketItem,
        as: 'BasketItems',
      }],
    });

    if (!basket) {
      res.clearCookie('basket_id');
      return res.status(404).json({ error: 'No basket found' });
    }

    res.status(200).json(basket);
  } catch (error) {
    console.error('Error in getBasket:', error);
    res.status(500).json({ error: 'Failed to fetch basket' });
  }
}

export async function removeItemFromBasket(req, res) {
  try {
    const { basket_item_id } = req.params;
    const basketId = req.cookies.basket_id;

    if (!basketId) {
      return res.status(404).json({ error: 'No basket found' });
    }

    const basket = await db.Basket.findByPk(basketId);
    
    if (!basket) {
      res.clearCookie('basket_id');
      return res.status(404).json({ error: 'No basket found' });
    }

    const deleted = await db.BasketItem.destroy({
      where: {
        basket_item_id,
        basket_id: basket.basket_id,
      },
    });

    if (deleted) {
      await basket.update({ last_modified: new Date() });
      return res.status(204).send();
    } else {
      return res.status(404).json({ error: 'Item not found in basket' });
    }
  } catch (error) {
    console.error('Error in removeItemFromBasket:', error);
    res.status(500).json({ error: 'Failed to remove item from basket' });
  }
}

export async function updateBasketItemQuantity(req, res) {
  try {
    const { basket_item_id } = req.params;
    const { quantity } = req.body;
    const basketId = req.cookies.basket_id;

    if (!basketId) {
      return res.status(404).json({ error: 'No basket found' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const basket = await db.Basket.findByPk(basketId);
    
    if (!basket) {
      res.clearCookie('basket_id');
      return res.status(404).json({ error: 'No basket found' });
    }

    const basketItem = await db.BasketItem.findOne({
      where: {
        basket_item_id,
        basket_id: basket.basket_id,
      },
    });

    if (!basketItem) {
      return res.status(404).json({ error: 'Basket item not found' });
    }

    await basketItem.update({ quantity });
    await basket.update({ last_modified: new Date() });

    return res.status(200).json(basketItem);
  } catch (error) {
    console.error('Error in updateBasketItemQuantity:', error);
    res.status(500).json({ error: 'Failed to update item quantity' });
  }
}

export async function clearBasket(req, res) {
  try {
    const userId = req.user.id;

    const basket = await db.Basket.findOne({
      where: {
        user_id: userId,
        status: 'active',
      },
    });

    if (!basket) {
      return res.status(404).json({ error: 'Basket not found' });
    }

    await db.BasketItem.destroy({
      where: { basket_id: basket.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error in clearBasket:', error);
    res.status(500).json({ error: 'Failed to clear basket' });
  }
}
