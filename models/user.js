const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 25,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
      minlength: 1,
      maxlength: 30,
    },
    location: {
      type: String,
      required: false,
      trim: true,
      minlength: 1,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

module.exports = User;
