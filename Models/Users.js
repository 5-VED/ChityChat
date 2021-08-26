const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      trim: true,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("users", userSchema);
module.exports = User;
