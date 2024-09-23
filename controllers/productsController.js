import axios from 'axios';
import dotenv from 'dotenv';
import chalk from 'chalk';

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

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const searchProducts = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${API_URL}/products/search?q=${query}&limit=0`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
};

export const sortProducts = async (req, res) => {
  const { sort } = req.query;
  try {
    const response = await axios.get(`${API_URL}/products?sort=${sort}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sort products' });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/products/categories?limit=0`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getProductCategoryList = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/products/category-list`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category list' });
  }
};
 
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const response = await axios.get(`${API_URL}/products/category/${category}?limit=0`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
};