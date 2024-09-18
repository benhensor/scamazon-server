// Middleware to load guest cart from session or cookie
const loadGuestCart = (req, res, next) => {
  if (!req.user) {
    req.cart = req.session.cart || [];
  }
  next();
};

export default loadGuestCart;