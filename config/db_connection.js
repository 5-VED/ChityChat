const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();


module.exports = mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useCreateIndex:true
  })
  .then((res) => console.log("Connected to database"))
  .catch((error) => console.log("Error: ", error));
