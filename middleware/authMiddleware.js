const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after "Bearer "
  if (!token) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Add only the user ID to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
// In the above code snippet, we have created an authMiddleware function that will be used to protect routes that require authentication. The function extracts the token from the Authorization header, verifies it using the JWT_SECRET, and attaches the decoded user object to the request object. If the token is invalid or missing, the function returns a 401 status code with an error message.