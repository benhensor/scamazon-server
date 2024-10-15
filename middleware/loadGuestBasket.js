// Middleware to load guest cart from session or cookie
const loadGuestBasket = (req, res, next) => {
  if (!req.user) {
    req.cart = req.session.cart || [];
  }
  next();
};

export default loadGuestBasket;