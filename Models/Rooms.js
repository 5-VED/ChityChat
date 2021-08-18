const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      default:null
    },
    members: {
      type:Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Rooms = new mongoose.model("rooms", schema);
module.exports = Rooms;

