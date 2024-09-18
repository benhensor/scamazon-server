const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // User is admin
  }
  return res.status(403).json({ error: 'Forbidden: Admin access only' });
};

export default isAdmin;
