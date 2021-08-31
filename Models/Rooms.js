const mongoose = require("mongoose");

const schema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
      default: null,
    },
    members: [
      {
        _id: {
          type: String,
          required: true,
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: true,
        },
        date: {
          type: Date,
          default: Date.now(),
          required: true,
        },
      },
    ],
    isDelete:{
      type : Boolean,
      default:false,
      required:true
    }
  },
  { timestamps: true }
);

const Rooms = new mongoose.model("rooms", schema);
module.exports = Rooms;
