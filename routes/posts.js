const { Router } = require("express");
const {
  getAllPosts,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");
const verifyToken = require("../middleware/verifyToken");
const validatePost = require("../middleware/validatePost");

const router = Router();

router.route("/").get(getAllPosts).post(verifyToken, validatePost(), addPost);
router
  .route("/:id")
  .put(verifyToken, validatePost(), updatePost)
  .delete(verifyToken, deletePost);

module.exports = router;
