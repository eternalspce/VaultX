const { body, validationResult } = require("express-validator");

// Validation middleware - handles errors and passes them to error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: "Validation failed",
      details: errors.array().map(e => ({ field: e.param, message: e.msg }))
    });
  }
  next();
};

// Auth validation rules
const validateRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and numbers"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const validateVault = [
  body("platform")
    .trim()
    .notEmpty()
    .withMessage("Platform is required")
    .isLength({ max: 100 })
    .withMessage("Platform must be 100 characters or less"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ max: 100 })
    .withMessage("Username must be 100 characters or less"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 200 })
    .withMessage("Password must be 200 characters or less"),
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateVault
};
