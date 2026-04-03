const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // 100 requests per window
  message: "Too many requests, please try again later",
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  skip: (req) => process.env.NODE_ENV === "development" // Skip in development
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true // Don't count successful requests
});

module.exports = { apiLimiter, authLimiter };
