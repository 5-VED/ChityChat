const express = require("express");
const router = express.Router();
const Room = require("../Controllers/Rooms");
const User = require("../Controllers/Users");
const Conversation = require("../Controllers/Conversation");
const {  validate,passwordValidate, fileValidate,} = require("../utils/validation");
const { authFxn} = require("../config/passport");
const multer = require("multer");
const passport = require("passport");
const PasswordReset = require("../Controllers/PasswordReset");
require("../config/passport")(passport);

//Funcion to store image files of user in diskStorange
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//Funcion to upload image in disk using Multer
const fileUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 5, //Maximum allowed size is 5 MB
  },
});

/*----------------------------------------------Users APIs---------------------------------------------------------------*/

router.post("/signup",fileUpload.single("file"),fileValidate,validate,User.createUser); //Create a User and signup
router.get("/user", User.getUser); //to get all users
router.delete("/deleteUser/:id", User.deleteUser); //to delete User
router.put( "/updateUser/:id",authFxn,fileUpload.single("file"),fileValidate,validate,User.updateUser); //to update User

/*----------------------------------------------Conversation APIs---------------------------------------------------------------*/

//router.post( "/conversation",authFxn,Conversation.conversationFilter,Conversation.chat); //Create a Conversarion
router.post("/conversation",Conversation.conversationFilter,Conversation.chat); //Create a Conversarion
router.put("/addMessage/:id", Conversation.pushMessage); //Push new message
router.put("/deleteMessages/:id", Conversation.deleteMessages); //Push new message
router.get("/getConveration/", Conversation.getConversation); //get Conversations from database
router.put('/clearChat/:id',Conversation.clearChat); //Api end point to clear conversation
router.get('/notification/:id',Conversation.notification); //Api End Point to send notifications
router.get('/getSpecificConversation/:id',Conversation.getSpecificConversation); //Api End Point to get particular chat
router.put('/archivedConversations/:id',Conversation.archivedConversations); //Api end point to archive conversation
router.put('/broadcast',Conversation.broadcast); //Api end point to clear conversation

/*----------------------------------------------Authencaion APIs---------------------------------------------------------------*/

router.post("/login", User.login); // User Login
router.post("/resetPassword", PasswordReset.resetPassword); // Sends the password Reset Link to the Client
router.put("/newPassword/:userId/:token",passwordValidate, PasswordReset.newPassword); // verify the Link and reset the password
router.post("/resetRoomPassword", PasswordReset.resetRoomPassword); // Sends the password Reset Link to the group Admin

/*----------------------------------------------Rooms APIs----------------------------------------------------------------------*/

router.post("/newRoom/:id",fileUpload.single("file"),fileValidate, Room.newRoom); //Api to create chat room;
router.get("/getRoom/:id", Room.getRoom); //Api to get all the rooms ;
router.put("/addMember/:id", Room.addMember); //Api to add new member in room ;
router.put("/removeMember/:id", Room.removeMember); //Api to add new member in room ;
router.delete("/deleteRoom/:id",Room.deleteRoom); //Api to remove member from room ;
router.put('/updateRoom/:id',fileUpload.single("file"),fileValidate,Room.updateRoom); //Api to Update Room


module.exports = router;
