const { body } = require("express-validator");

const validateRegister = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 25 })
      .withMessage("Name must be between 2-25 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("bio")
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage("Bio must be between 1-30 characters"),
    body("location")
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage("Location must be between 1-30 characters"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ];
};

module.exports = validateRegister;
