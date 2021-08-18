const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    // count: {
    //   type: Number,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Notificaion = new mongoose.model("notificaions", Schema);
module.exports = Notificaion;
