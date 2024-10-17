import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  // console.log('Token received in middleware:', token);

  if (!token) {
    console.log('Token missing');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Token verified successfully:', verified);
    req.user = verified;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;