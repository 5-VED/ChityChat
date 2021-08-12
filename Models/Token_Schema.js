const { Schema} = require("mongoose");
const mongoose = require("mongoose");

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 3600,
    },
  },
  { timestamps: true }
);

const tokenSchema = mongoose.model("token", schema);

module.exports = tokenSchema;
