import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './models/index.js'; 

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://scamazon-frontend.vercel.app',
  credentials: true, // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// No need to call sequelize.sync() here, it's handled in models/index.js

// Simple test route
app.get('/api/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://scamazon-frontend.vercel.app'); // Explicitly set the header for this route
  res.json({ message: 'Hello World!!!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
