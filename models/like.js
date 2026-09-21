const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = model("Like", likeSchema);

module.exports = Like;
