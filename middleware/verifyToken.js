import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    console.log('Token missing');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default verifyToken;