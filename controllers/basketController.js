import db from '../models/index.js';
import { Op } from 'sequelize';

export const fetchBasket = async (req, res) => {
  try {
    const basket = await db.Basket.findOne({
      where: { 
        user_id: req.user.user_id,
        status: 'active'
      },
      include: [{
        model: db.BasketItem,
        attributes: ['basket_item_id', 'basket_id', 'product_data', 'quantity', 'is_selected'],
      }]
    })

    if (!basket) {
      return res.json({
        items: [],
        count: 0,
        total: 0
      })
    }

    const transformedItems = basket.BasketItems.map(item => ({
      basket_item_id: item.basket_item_id,
      basket_id: parseInt(basket.basket_id),
      product_data: item.product_data,
      quantity: item.quantity,
      is_selected: item.is_selected
    }))

    res.json({
      items: transformedItems,
      count: basket.count,
      total: basket.total
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch basket' })
  }
}

export const updateBasket = async (req, res) => {
  try {
    const { basket_id, user_id, items, count, total, status } = req.body;
    console.log('Updating basket:', { user_id: req.user.user_id, items, count, total });

    const [basket] = await db.Basket.findOrCreate({
      where: { 
        user_id: req.user.user_id,
        status: 'active'
      },
      defaults: { 
        basket_id,
        count, 
        total,
        status,
        last_modified: new Date()
      }
    })

    // Update existing basket
    if (!basket.isNewRecord) {
      await basket.update({ 

        count, 
        total,
        status,
        last_modified: new Date()
      });
    }

    // Delete existing items
    await db.BasketItem.destroy({
      where: { basket_id: basket.basket_id }
    })

    // Create new items
    if (items?.length > 0) {
      const basketItems = items.map(item => ({
        basket_item_id: item.basket_item_id,
        basket_id: basket.basket_id,
        product_data: item.product_data,  // Store the entire product data
        quantity: item.quantity,
        is_selected: item.is_selected,
      }));
      console.log('Creating basket items:', basketItems);
      await db.BasketItem.bulkCreate(basketItems);
    }

    // Return the updated basket with items
    const updatedBasket = await db.Basket.findOne({
      where: { basket_id: basket.basket_id },
      include: [{
        model: db.BasketItem,
        attributes: ['basket_item_id', 'basket_id', 'product_data', 'quantity', 'is_selected'],
      }]
    });

    res.json(updatedBasket);
  } catch (error) {
    console.error('Server error updating basket:', error);
    res.status(500).json({ 
      error: 'Failed to update basket', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const toggleItemSelected = async (req, res) => {
  try {
    const { basket_item_id } = req.params

    const basketItem = await db.BasketItem.findOne({
      include: [{
        model: db.Basket,
        where: { 
          user_id: req.user.user_id,
          status: 'active'
        }
      }],
      where: { basket_item_id }
    })

    if (!basketItem) {
      return res.status(404).json({ error: 'Basket item not found' })
    }

    await basketItem.update({ 
      is_selected: !basketItem.is_selected,
      last_modified: new Date()
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle item selection' })
  }
}

export const updateItemQuantity = async (req, res) => {
  try {
    const { basket_item_id } = req.params
    const { quantity } = req.body

    const basketItem = await db.BasketItem.findOne({
      include: [{
        model: Basket,
        where: { 
          user_id: req.user.user_id,
          status: 'active'
        }
      }],
      where: { basket_item_id }
    })

    if (!basketItem) {
      return res.status(404).json({ error: 'Basket item not found' })
    }

    await basketItem.update({ 
      quantity,
      last_modified: new Date()
    })

    // Update basket totals
    const updatedBasket = await Basket.findOne({
      where: { basket_id: basketItem.basket_id },
      include: [{
        model: db.BasketItem,
        include: [Product]
      }]
    })
    
    if (updatedBasket) {
      await updatedBasket.update({
        count: updatedBasket.BasketItems.reduce((sum, item) => sum + item.quantity, 0),
        total: updatedBasket.BasketItems.reduce((sum, item) => 
          sum + (item.Product.price * item.quantity), 0),
        last_modified: new Date()
      })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item quantity' })
  }
}

// // Get user Basket (authenticated)
// export const getUserBasket = async (req, res) => {
//   try {
//     const userId = req.user.user_id;
//     const basket = await db.Basket.findOne({
//       where: { user_id: userId, status: 'active' },
//       include: [{ model: db.BasketItem }],
//     });

//     if (!basket) {
//       return res.status(404).json({ message: 'No active basket found' });
//     }

//     res.json(basket);
//   } catch (error) {
//     console.error('Error in getUserBasket:', error);
//     res.status(500).json({ message: 'Error fetching basket' });
//   }
// };

// // Sync Basket with user account (authenticated)
// export const createUserBasket = async (req, res) => {
//   try {
//     console.log('userId', req.user)
//     const userId = req.user.user_id;
//     const guestBasketItems = req.body; // Assumes an array of basket items

//     let basket = await db.Basket.findOne({
//       where: { user_id: userId, status: 'active' },
//     });

//     if (!basket) {
//       basket = await db.Basket.create({ basket_id: userId, user_id: userId, status: 'active' });
//     }

//     // Add guest items to the user's basket
//     for (const item of guestBasketItems) {
//       await db.BasketItem.create({
//         basket_id: basket.basket_id,
//         product: item.product,
//         quantity: item.quantity,
//       });
//     }

//     // Fetch the updated basket with items
//     const updatedBasket = await db.Basket.findOne({
//       where: { basket_id: basket.basket_id },
//       include: [{ model: db.BasketItem }], 
//     });

//     res.status(201).json(updatedBasket);
//   } catch (error) {
//     console.error('Error in createUserBasket:', error);
//     res.status(500).json({ message: 'Error syncing basket' });
//   }
// };

// // Add item to Basket (authenticated or guest)
// export const addItemToBasket = async (req, res) => {
//   console.log('Adding item to basket:', req.body);
//   try {
//     const { basket_item_id, basket_id, product_data, quantity, is_selected } = req.body.basketItem;
//     const { productId } = req.body.productId;
//     console.log('productId', productId)
//     let basket;

//     if (req.user) {
//       // Authenticated user
//       basket = await db.Basket.findOne({
//         where: { user_id: req.user.user_id, status: 'active' },
//       });

//       // Check if the basket matches the item's basket_id
//       if (basket_id && basket.basket_id !== basket_id) {
//         return res.status(403).json({ message: 'Not authorized to update this basket' });
//       }

//       if (!basket) {
//         basket = await db.Basket.create({ user_id: req.user.user_id, status: 'active' });
//       }
//     } else {
//       // Guest user
//       basket = await db.Basket.create({ status: 'active' });
//     }

//     // Check if the item is already in the basket
//     const existingItem = await db.BasketItem.findOne({
//       where: {
//         basket_id: basket.basket_id,
//         // Check if product_data contains productId (assuming product_data is a JSON object with 'id' as the key)
//         product_data: {
//           [Op.contains]: { id: productId }  // This checks if product_data contains the id field with the given productId
//         },
//       },
//     });

//     if (existingItem) {
//       // If the item already exists, update the quantity
//       console.log('existingItem', existingItem)
//       await existingItem.update({ quantity: existingItem.quantity + quantity });
//       return res.json(existingItem);
//     } else {
//       // Add the item to the basket
//       const basketItem = await db.BasketItem.create({
//         basket_item_id: basket_item_id,
//         basket_id: basket.basket_id,
//         product_data: product_data,
//         quantity: quantity,
//         is_selected: is_selected,
//       });
//     }


//     res.status(201).json(basketItem);
//   } catch (error) {
//     console.error('Error in addItemToBasket:', error);
//     res.status(500).json({ message: 'Error adding item to basket' });
//   }
// };

// // Toggle item selected status in Basket (authenticated)
// export const toggleItemSelected = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     console.log('basketItem', id)
//     const basketItem = await db.BasketItem.findByPk(id);
//     if (!basketItem) {
//       return res.status(404).json({ message: 'Basket item not found' });
//     }

//     // Check if the user is authenticated
//     if (!req.user || !req.user.user_id) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     // Ensure the basket belongs to the user
//     const basket = await db.Basket.findByPk(basketItem.basket_id);
//     if (!basket || basket.user_id !== req.user.user_id) {
//       return res.status(403).json({ message: 'Not authorized to update this basket' });
//     }

//     await basketItem.update({ is_selected: !basketItem.is_selected });

//     res.json(basketItem);
//   } catch (error) {
//     console.error('Error in toggleItemSelected:', error);
//     res.status(500).json({ message: 'Error toggling item selected status' });
//   }
// };

// // Select all items in Basket (authenticated or guest)
// export const selectAllItems = async (req, res) => {
//   try {

//     if (!req.user || !req.user.user_id) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const basket = await db.Basket.findOne({
//       where: { user_id: req.user.user_id, status: 'active' },
//       include: [{ model: db.BasketItem }],
//     });

//     if (!basket) {
//       return res.status(404).json({ message: 'No active basket found' });
//     }

//     await db.BasketItem.update(
//       { is_selected: true },
//       { where: { basket_id: basket.basket_id } }
//     );

//     // Fetch the updated basket with items
//     const updatedBasket = await db.Basket.findOne({
//       where: { basket_id: basket.basket_id },
//       include: [{ model: db.BasketItem }],
//     });

//     res.json(updatedBasket);
//   } catch (error) {
//     console.error('Error in selectAllItems:', error);
//     res.status(500).json({ message: 'Error selecting all items' });
//   }
// };

// // Deselect all items in Basket (authenticated or guest)
// export const deselectAllItems = async (req, res) => {
//   try {
//     if (!req.user || !req.user.user_id) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const basket = await db.Basket.findOne({
//       where: { user_id: req.user.user_id, status: 'active' },
//       include: [{ model: db.BasketItem }],
//     });

//     if (!basket) {
//       return res.status(404).json({ message: 'No active basket found' });
//     }

//     await db.BasketItem.update(
//       { is_selected: false },
//       { where: { basket_id: basket.basket_id } }
//     );

//     // Fetch the updated basket with items
//     const updatedBasket = await db.Basket.findOne({
//       where: { basket_id: basket.basket_id },
//       include: [{ model: db.BasketItem }],
//     });

//     res.json(updatedBasket);
//   } catch (error) {
//     console.error('Error in deselectAllItems:', error);
//     res.status(500).json({ message: 'Error deselecting all items' });
//   }
// };

// // Update item quantity in Basket (authenticated or guest)
// export const updateItemQuantity = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quantity } = req.body;
//     const basketItem = await db.BasketItem.findByPk(id);
//     console.log('basketItem', id, quantity, basketItem)

//     if (!basketItem) {
//       return res.status(404).json({ message: 'Basket item not found' });
//     }

//     // If authenticated, ensure the basket belongs to the user
//     if (req.user) {
//       const basket = await db.Basket.findByPk(basketItem.basket_id);
//       if (basket.user_id !== req.user.user_id) {
//         return res.status(403).json({ message: 'Not authorized to update this basket' });
//       }
//     }

//     await basketItem.update({ quantity });
//     console.log('updated basketItem', basketItem)
//     res.json(basketItem);
//   } catch (error) {
//     console.error('Error in updateItemQuantity:', error);
//     res.status(500).json({ message: 'Error updating item quantity' });
//   }
// };

// // Remove item from Basket (authenticated or guest)
// export const removeItemFromBasket = async (req, res) => {
//   try {
//     const { basket_item_id } = req.params;

//     const basketItem = await db.BasketItem.findByPk(basket_item_id);

//     if (!basketItem) {
//       return res.status(404).json({ message: 'Basket item not found' });
//     }

//     // If authenticated, ensure the basket belongs to the user
//     if (req.user) {
//       const basket = await db.Basket.findByPk(basketItem.basket_id);
//       if (basket.user_id !== req.user.user_id) {
//         return res.status(403).json({ message: 'Not authorized to remove this item' });
//       }
//     }

//     await basketItem.destroy();

//     res.json({ message: 'Item removed from basket' });
//   } catch (error) {
//     console.error('Error in removeItemFromBasket:', error);
//     res.status(500).json({ message: 'Error removing item from basket' });
//   }
// };

// // Clear Basket (authenticated)
// export const clearBasket = async (req, res) => {
//   try {
//     const userId = req.user.user_id;

//     const basket = await db.Basket.findOne({
//       where: { user_id: userId, status: 'active' },
//     });

//     if (!basket) {
//       return res.status(404).json({ message: 'No active basket found' });
//     }

//     await db.BasketItem.destroy({
//       where: { basket_id: basket.basket_id },
//     });

//     res.json({ message: 'Basket cleared successfully' });
//   } catch (error) {
//     console.error('Error in clearBasket:', error);
//     res.status(500).json({ message: 'Error clearing basket' });
//   }
// };