const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Header:", authHeader);

  if (!authHeader) return res.status(401).send("Access denied");

  const token = authHeader.split(" ")[1]; // ✅ FIX HERE

  console.log("Extracted token:", token);
  console.log("JWT_SECRET verify:", process.env.JWT_SECRET);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(400).send("Invalid token");
  }
};