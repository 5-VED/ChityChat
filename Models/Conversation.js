const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const convSchema = new Schema(
  {
    sender_id: {
      type: String,
      required: false,
      default: null
    },
    reciever_id: {
      type: String,
      required: false,
    },
    group_id: {
      type: String,
      required: false,
      default: null,
    },
    messages: [
      {
        _id: {
          type: String,
        },
        message: {
          type: String,
        },
        isRead: {
          type: Boolean,
          default: false,
          required: false,
        },
        date: {
          type: Date,
          default: Date.now(),
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const conversation = new mongoose.model("conversation", convSchema);
module.exports = conversation;
