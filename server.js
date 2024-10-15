// @ts-nocheck
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import db from './models/index.js';
import sequelize from './config/database.js';

import userRoutes from './routes/userRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
// import orderItemRoutes from './routes/orderItemRoutes.js';
import basketRoutes from './routes/basketRoutes.js';
import basketItemRoutes from './routes/basketItemRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';


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
app.use(compression());
app.use(morgan('combined'));
app.use(helmet({
  contentSecurityPolicy: false, // Disable if your CSP configuration is custom
}));

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Failed to sync database:', err));


// Test database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


// Simple test route
app.get('/api/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'https://scamazon-frontend.vercel.app'); // Explicitly set the header for this route
  res.json({ message: 'Hello World!!!' });
});


// Routes
app.use('/api/user', userRoutes);
app.use('/api/products', productsRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/order-items', orderItemRoutes);
app.use('/api/basket', basketRoutes);
app.use('/api/basket-items', basketItemRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/reviews', reviewRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;
