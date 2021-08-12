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


// schema.pre('save', function (next) {
//   var user = this;
//   // Generate Bcrypt Password
//   if (this.isModified('password') || this.isNew) {
//     user.password = Helper.bcrypt(user.password);
//     next();
//   } else {
//       return next();
//   }
// });


const Rooms = new mongoose.model("rooms", schema);
module.exports = Rooms;

