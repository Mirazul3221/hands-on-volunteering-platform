const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    // Remove "Bearer " if present and verify token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log(decoded)
    req.user = decoded; // Attach user info to request
    next(); // Continue to next middleware or controller
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
};

module.exports = authMiddleware; // ✅ Export correctly
