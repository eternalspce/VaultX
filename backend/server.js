require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimit");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "SECRET_KEY"];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  logger.error("Missing required environment variables", { missing: missingVars });
  logger.error("Please copy .env.example to .env and fill in the required values");
  process.exit(1);
}

// Security Middleware
app.use(helmet()); // Set security HTTP headers

// CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",");
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting
app.use("/api/", apiLimiter);

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, { query: req.query, body: req.body?.email ? { email: req.body.email } : null });
  next();
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/vault", require("./routes/vault"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  res.status(500).json({ error: NODE_ENV === "development" ? err.message : "Server error" });
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("✅ MongoDB connected"))
  .catch(err => {
    logger.error("MongoDB connection failed", { error: err.message });
    process.exit(1);
  });

// Server
app.listen(PORT, () => {
  logger.info(`Server started`, { port: PORT, environment: NODE_ENV, allowedOrigins });
});