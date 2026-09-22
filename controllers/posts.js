const mongoose = require("mongoose");
const Post = require("../models/post");
const { validationResult } = require("express-validator");

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}, { __v: 0 });
    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts });
    }
    return res
      .status(200)
      .json({ message: "Posts retrieved successfully", posts });
  } catch (error) {
    next(error);
  }
};

const addPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }
    const newPost = new Post({
      content,
      userId: req.userId,
    });

    await newPost.save();

    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const existingPost = await Post.findOne({ _id: postId });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.userId !== String(existingPost.userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: postId });

    return res
      .status(200)
      .json({ message: "Post deleted successfully", existingPost });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    const existingPost = await Post.findOne({ _id: postId });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.userId !== String(existingPost.userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { content },
      { returnDocument: "after" },
    );

    return res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  addPost,
  deletePost,
  updatePost,
};
