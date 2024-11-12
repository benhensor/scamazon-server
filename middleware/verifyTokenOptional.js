import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const verifyTokenOptional = (req, res, next) => {
  const token = req.cookies.authToken || req.headers['authorization'];
  if (!token) {
    req.user = null; // Guest user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Authenticated user
    next();
  } catch (err) {
    req.user = null; // Invalid token, treat as guest
    next();
  }
};

export default verifyTokenOptional;