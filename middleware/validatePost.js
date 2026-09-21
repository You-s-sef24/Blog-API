const { body } = require("express-validator");

const validatePost = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isLength({ max: 5000 })
      .withMessage("Content must not exceed 5000 characters")
  ];
};

module.exports = validatePost;
