const Comment = require("../models/comment");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Post = require("../models/post");

const getAllComments = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }
    const comments = await Comment.find({ postId });

    if (comments.length === 0) {
      return res.status(200).json({ message: "No comments found", comments });
    }

    return res
      .status(200)
      .json({ message: "Comments retrieved successfully", comments });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const content = req.body.content;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const existingPost = await Post.findOne({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const newComment = new Comment({
      userId: req.userId,
      postId,
      content,
    });
    await newComment.save();
    return res
      .status(201)
      .json({ message: "Comment added successfully", newComment });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const postId = req.params.id;
    const content = req.body.content;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ message: result.array()[0].msg });
    }

    const existingPost = await Post.findOne({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingComment = await Comment.findOne({ _id: commentId });
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (String(existingComment.userId) !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await existingComment.updateOne({ content });
    return res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const existingPost = await Post.findOne({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingComment = await Comment.findOne({ _id: commentId });
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (String(existingComment.userId) !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getCommentsCount = async (req, res, next) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const existingPost = await Post.findOne({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentsCount = await Comment.countDocuments({ postId });
    return res.status(200).json({ commentsCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  getCommentsCount,
};
