import db from '../models/index.js';
import { v4 as UUIDV4 } from 'uuid';

export const addOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const user_id = req.user.user_id;
    const { order_id, order_placed, shipping, order_items, total } = req.body;
    console.log(req.body);

    if (!user_id) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    // Check if order_id exists
    const orderExists = await db.Order.findOne({ 
      where: { order_id },
      transaction 
    });

    if (orderExists) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Order already exists' });
    }

    // Create order with transaction
    const order = await db.Order.create({
      order_id,
      user_id,
      order_placed,
      shipping,
      total,
    }, { transaction });

    // Create order items with transaction
    const orderItemPromises = order_items.map(item => 
      db.OrderItem.create({
        order_item_id: UUIDV4(),
        order_id: order_id,
        product_data: item.product_data,
        quantity: item.quantity,
        is_selected: item.is_selected,
      }, { transaction })
    );

    await Promise.all(orderItemPromises);

    // Commit transaction
    await transaction.commit();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
}

export const fetchOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const orders = await db.Order.findAll({
      where: { user_id },
      include: [
        {
          model: db.OrderItem,
          as: 'order_items',
        }
      ]
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getOrderById = async (req, res) => {}

export const deleteOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    // Check if order exists
    const order = await db.Order.findOne({ 
      where: { order_id: id },
      transaction 
    });

    if (!order) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Order does not exist' });
    }

    // Delete order with transaction
    await db.Order.destroy({
      where: { order_id: id },
      transaction,
    });

    // Delete order items with transaction
    await db.OrderItem.destroy({
      where: { order_id: id },
      transaction,
    });

    // Commit transaction
    await transaction.commit();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
}