import db from '../models/index.js';
import { Op } from 'sequelize';

export const fetchPaymentMethods = async (req, res) => {
  const userId = req.user.user_id;
  console.log('Fetching payment methods for user:', userId);
  
  try {
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    
    // Log table status
    const tableExists = await db.PaymentMethod.findAndCountAll();
    console.log('Payment methods found:', tableExists.count);
    
    const paymentMethods = await db.PaymentMethod.findAll();
    console.log('Retrieved payment methods:', paymentMethods);
    
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
}

export const setDefaultPaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.params;

  console.log('Setting default payment method:', paymentMethodId);

  try {
    // Ensure the paymentMethodId is provided
    if (!paymentMethodId) {
      return res.status(400).json({ message: 'Payment method ID is required' });
    }

    // Fetch all payment methods
    const paymentMethods = await db.PaymentMethod.findAll();

    // Iterate through payment methods and update statuses
    for (const paymentMethod of paymentMethods) {
      const [month, year] = paymentMethod.end_date.split('/').map(Number); // Parse MM/YY
      const expirationDate = new Date(`20${year}`, month - 1); // Convert to Date (e.g., 01/24 -> Jan 2024)

      if (expirationDate < new Date()) {
        // If expired, update status to 'expired'
        await paymentMethod.update({ status: 'expired' });
      }
    }

    // Set the current default payment method to 'valid', excluding expired ones
    await db.PaymentMethod.update(
      { status: 'valid' },
      {
        where: {
          status: 'default',
          end_date: { [Op.ne]: null } // Ensure end_date is not null (for safety, even if not applicable)
        }
      }
    );

    // Find the payment method with the given ID
    const paymentMethod = await db.PaymentMethod.findOne({
      where: {
        payment_method_id: paymentMethodId
      }
    });

    // Parse and check if the payment method is expired
    const [methodMonth, methodYear] = paymentMethod.end_date.split('/').map(Number);
    const methodExpirationDate = new Date(`20${methodYear}`, methodMonth - 1);

    if (methodExpirationDate < new Date()) {
      return res.status(400).json({ message: 'Cannot set an expired payment method as default' });
    }

    // Update the specified payment method to 'default'
    await paymentMethod.update({ status: 'default' });

    // Respond with the updated payment method
    res.status(200).json(paymentMethod);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to set default payment method' });
  }
};

