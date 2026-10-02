const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Like = require("../models/like");
const Post = require("../models/post");
const { validationResult } = require("express-validator");

const getAllPosts = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let currentUserId = null;

    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        currentUserId = decoded.id;
      } catch {}
    }

    const posts = await Post.find({}, { __v: 0 })
      .sort({ createdAt: -1 })
      .populate("userId", "name");
    const myLikes = currentUserId
      ? await Like.find({ userId: currentUserId })
      : [];
    const likedPostIds = new Set(myLikes.map((like) => String(like.postId)));
    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: likedPostIds.has(String(post._id)),
      isMine: currentUserId ? String(post.userId._id) === currentUserId : false,
    }));

    if (postsWithLikeStatus.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts found", posts: postsWithLikeStatus });
    }

    return res.status(200).json({
      message: "Posts retrieved successfully",
      posts: postsWithLikeStatus,
    });
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }
    const posts = await Post.find({ userId: userId }, { __v: 0 })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    if (posts.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts found for this user", posts });
    }

    return res
      .status(200)
      .json({ message: "User posts retrieved successfully", posts });
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
    await newPost.populate("userId", "name");

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
  getUserPosts,
};
