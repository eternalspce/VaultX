const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authLimiter } = require("../middleware/rateLimit");
const { validateRegister, validateLogin, handleValidationErrors } = require("../middleware/validation");
const logger = require("../utils/logger");

// Register
router.post("/register", authLimiter, validateRegister, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      logger.warn("Registration - email already exists", { email });
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    logger.info("User registered", { email });
    res.status(201).json({ message: "Account created successfully. Please login." });
  } catch (err) {
    logger.error("Registration error", { email: req.body.email, error: err.message });
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", authLimiter, validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login attempt - user not found", { email });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Login attempt - wrong password", { email });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );

    logger.info("User logged in", { email, userId: user._id });
    res.json({ token, userId: user._id });
  } catch (err) {
    logger.error("Login error", { email: req.body.email, error: err.message });
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  logger.info("User logout");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;