// backend/middleware/roleMiddleware.js

exports.adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Yalnızca admin erişebilir' });
    }
    next();
  };
  