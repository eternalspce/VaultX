const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn("Auth - no authorization header");
    return res.status(401).json({ error: "Access denied - no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    logger.warn("Auth - invalid token", { error: err.message });
    res.status(401).json({ error: "Invalid or expired token" });
  }
};