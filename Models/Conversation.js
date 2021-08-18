const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const convSchema = new Schema({
  sender_id: {
    type: String,
    required: false,
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
  messages: {
    type: Array,
    required: true,
  },
},{
  timestamps:true
});

const conversation = new mongoose.model("conversation", convSchema);
module.exports = conversation;
