const { Router } = require("express");
const {
  getAllPosts,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");
const verifyToken = require("../middleware/verifyToken");
const validatePost = require("../middleware/validatePost");
const toogleLike = require("../controllers/likes");
const {
  addComment,
  getAllComments,
  deleteComment,
  updateComment,
} = require("../controllers/comments");
const validateComment = require("../middleware/validateComment");
const router = Router();

router.route("/").get(getAllPosts).post(verifyToken, validatePost(), addPost);
router
  .route("/:id")
  .put(verifyToken, validatePost(), updatePost)
  .delete(verifyToken, deletePost);

router.post("/:id/likes", verifyToken, toogleLike);

router
  .route("/:id/comments/:commentId")
  .put(verifyToken, validateComment(), updateComment)
  .delete(verifyToken, deleteComment);

router
  .route("/:id/comments/")
  .get(getAllComments)
  .post(verifyToken, validateComment(), addComment);

module.exports = router;
