const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    admin:{
      type:String,
      required:true
    },
    image: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      default: null,
    },
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Rooms = new mongoose.model("rooms", schema);
module.exports = Rooms;
