const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token and check expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token is expired or invalid
        return res.status(401).json({ message: "Unauthorized: Token expired or invalid", error: err.message });
      }

      // 3. If token is valid, attach decoded user to request
      req.user = decoded;
      next(); // Continue to next middleware/route
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = {authenticate,};
