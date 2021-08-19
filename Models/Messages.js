const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  sender_id: {
    type: String,
    required: false,
  },
  chat: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Messages = new mongoose.model("messages", Schema);
module.exports = Messages;
