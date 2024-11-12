import db from '../models/index.js';

// Add a new address
export const addAddress = async (req, res) => {
  console.log('Adding address:', req.user);
  console.log('Adding address:', req.body);
  try {
    if (!req.user || !req.user.user_id) { // Check for 'id'
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { full_name, address_line1, city, postcode, country } = req.body;

    if (!full_name || !address_line1 || !city || !postcode || !country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAddress = await db.Address.create({
      ...req.body,
      user_id: req.user.user_id 
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error adding address:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "An error occurred while adding the address" });
  }
};


// Set an address as default
export const setDefaultAddress = async (req, res) => {

  console.log('Request received to set default address');
  const addressId = req.params.id;
  console.log('Parameters:', req.params);
  console.log('User ID:', req.user.user_id); // Ensure this is set correctly
  try {
    await db.Address.update(
      { is_default: false },
      { where: { user_id: req.user.user_id } } 
    );

    // Set the specified address as default
    const [numberOfAffectedRows, updatedAddress] = await db.Address.update(
      { is_default: true },
      { where: { address_id: addressId, user_id: req.user.user_id } } // Use the correct addressId
    );

    if (numberOfAffectedRows === 0) { // Check if any rows were updated
      return res.status(404).json({ message: 'Address not found' });
    }

    // Fetch the updated address to return it
    const address = await db.Address.findOne({
      where: { address_id: addressId }
    });

    res.json(address); // Return the updated address
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const updatedAddress = await db.Address.findOneAndUpdate(
      { address_id: req.params.address_id, user_id: req.user.user_id }, // Accessing user ID correctly
      req.body,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await db.Address.findOneAndDelete({
      address_id: req.params.address_id,
      user_id: req.user.user_id // Accessing user ID correctly
    });
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getUserAddresses = async (req, res) => {
  console.log(req.user);
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized, token missing or invalid' });
    }

    const addresses = await db.Address.findAll({ where: { user_id: req.user.user_id }}); 
    res.json(addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

