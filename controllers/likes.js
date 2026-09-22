const mongoose = require("mongoose");
const Post = require("../models/post");
const Like = require("../models/like");

const toogleLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    const existingPost = await Post.findOne({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const liked = await Like.findOne({ userId: req.userId, postId });
    if (liked) {
      await Like.deleteOne({ userId: req.userId, postId });
      return res.status(200).json({ message: "Unliked" });
    }
    const like = new Like({
      postId,
      userId: req.userId,
    });
    await like.save();
    return res.status(200).json({ message: "Liked" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Liked" });
    }
    next(error);
  }
};

const getLikesCount = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const existingPost = await Post.findOne({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likesCount = await Like.countDocuments({ postId });
    return res.status(200).json({ likesCount });
  } catch (error) {
    next(error);
  }
};

module.exports = { toogleLike, getLikesCount };
