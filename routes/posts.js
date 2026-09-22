const { Router } = require("express");
const {
  getAllPosts,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/posts");
const verifyToken = require("../middleware/verifyToken");
const validatePost = require("../middleware/validatePost");
const { toogleLike, getLikesCount } = require("../controllers/likes");
const {
  addComment,
  getAllComments,
  deleteComment,
  updateComment,
  getCommentsCount,
} = require("../controllers/comments");
const validateComment = require("../middleware/validateComment");
const router = Router();

router.route("/").get(getAllPosts).post(verifyToken, validatePost(), addPost);
router
  .route("/:id")
  .put(verifyToken, validatePost(), updatePost)
  .delete(verifyToken, deletePost);

router.route("/:id/likes").post(verifyToken, toogleLike).get(getLikesCount);

router
  .route("/:id/comments/:commentId")
  .put(verifyToken, validateComment(), updateComment)
  .delete(verifyToken, deleteComment);

router
  .route("/:id/comments")
  .get(getAllComments)
  .post(verifyToken, validateComment(), addComment);

router.get("/:id/comments-count", getCommentsCount);

module.exports = router;
