const { body } = require("express-validator");

const validateComment = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 1000 })
      .withMessage("Content must not exceed 1000 characters")
  ];
};

module.exports = validateComment;
