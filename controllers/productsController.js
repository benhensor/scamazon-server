import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.PRODUCTS_API_URL;

export const getAllProducts = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/products?limit=0`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};