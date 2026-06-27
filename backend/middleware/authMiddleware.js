const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header (format: "Bearer <token>")
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // add user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
