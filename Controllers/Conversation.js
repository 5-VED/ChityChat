const Conversation = require("../Models/Conversation");
const Room = require("../Models/Rooms");
const User = require("../Models/Users");
const { ReS, ReE } = require("../utils/responseService");
const _ = require("lodash");
const e = require("express");

class conversation {
  //Method to create new Conversation
  async chat(req, res, next) {
    const conversation = await new Conversation({
      sender_id: req.body.sender_id,
      reciever_id: req.body.reciever_id,
      group_id: req.body.group_id,
      isArchived: req.body.group_id,
      messages: req.body.messages,
      isDelete:req.body.isDelete
    });
    conversation
      .save()
      .then((result) => {
        console.log(conversation);
        ReS(res, result);
      })
      .catch((error) => {
        console.log(error);
        console.log(req.body.messages, "req.body");
        ReE(res, error, 500);
        //res.status(500).json({ error: error });
      });
  }

  //Api to push new messages
  async pushMessage(req, res) {
    const conversaton = await Conversation.findOne({ _id: req.params.id });

    const id = req.body.messages._id;
    const message = req.body.messages.message;
    const arr = conversaton.messages;

    const pushFxn = function () {
      let newMessage = {
        _id: id,
        message: message,
      };
      arr.push(newMessage);
    };

    const roomId = conversaton.group_id;
    if (roomId !== null) {
      //console.log(roomId);
      const room = await Room.findOne({ _id: roomId });
      if (!room) {
        return ReE(res, "No such Room Exist", 400);
      }

      if (room.members.includess(id)) {
        console.log(id);
        pushFxn();
        await conversaton.save();
        return ReS(res, "Message Send");
      }
      return ReE(res, "Wrong Group", 400);
    }

    if (roomId === null) {
      const sender_id = conversaton.sender_id;
      const reciever_id = conversaton.reciever_id;
      if (sender_id === id || reciever_id === id) {
        pushFxn();
        await conversaton.save();
        return ReS(res, "Message Send");
      } else {
        return ReE(res, "Cant Send Message", 400);
      }
    }
  }

  //Filter to prevent duplicate entries
  async conversationFilter(req, res, next) {
    const conversation = await Conversation.aggregate([
      {
        $group: {
          // Group by fields to match on (a,b)
          _id: { sender_id: "$sender_id", reciever_id: "$reciever_id" },

          // Count number of matching docs for the group
          count: { $sum: 1 },

          // Save the _id for matching docs
          docs: { $push: "$_id" },
        },
      },

      // Limit results to duplicates (more than 1 match)
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    if (conversation <= 1) {
      next();
    } else {
      console.log(conversation);
      ReE(res, "Something Went Wrong", 400);
    }
  }

  //API to get Conversations
  async getConversation(req, res, next) {
    const conversation = await Conversation.find({ isArchived: "false" });
    //console.log(conversation[0]._id)
    if (conversation) {
      // console.log(conversation);
      res.status(201).json(conversation);
    } else {
      return ReE(res, "Something Went Wrong", 400);
    }
    next();
  }

  //Api to get Specific Conversation
  async getSpecificConversation(req, res) {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    //console.log(conversation);
    if (conversation) {
      let arr = conversation.messages;
      let msg = arr[arr.length - 1].message;
      res.status(201).json(msg);
    } else {
      return ReE(res, "No Such Conversation Exist", 400);
    }
  }

  //Api endpoint to clear chat
  async clearChat(req, res) {
    // console.log("he");
    const conversation = await Conversation.findOne({ _id: req.params.id });
    let arr = conversation.messages;

    while (arr.length > 0) {
      arr.pop();
    }
    if (!arr.length === 0) {
      return ReE(res, "Chat cant be cleared please try again later", 400);
    }
    await conversation.save();
    ReS(res, "Chat Cleared");
  }

  //Api to delete messages
  async deleteMessages(req, res) {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    if (!conversation) {
      return ReE(res, "No such Conversation Exist", 400);
    }

    let temp = req.body.messages;
    //console.log(temp);

    const requiredArr = [];
    for (let i = 0; i < conversation.messages.length; i++) {
      let obj = {};
      obj._id = conversation.messages[i]._id;
      obj.message = conversation.messages[i].message;
      requiredArr.push(obj);
    }

    //console.log(requiredArr);

    conversation.messages = _.pullAllWith(requiredArr, temp, _.isEqual);

    //console.log(requiredArr);

    await conversation.save();
    return ReS(res, "Messages Deleted Succesfully");
  }

  //Api end for inserting Notifications in mongodb
  async notification(req, res) {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    if (!conversation) {
      return ReE(res, "No such Conversation Exist", 400);
    }

    let arr = conversation.messages;
    let recieverId = conversation.reciever_id;
    let groupId = conversation.group_id;

    console.log(recieverId);
    console.log(groupId);

    if (groupId === null) {
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]._id === recieverId && arr[i].isRead === false) {
          count = count + 1;
          arr[i].isRead = true;
        }
      }
      console.log(count);
      await conversation.save();
      ReS(res, `You Have ${count} notifications`, 200);
    }
  }

  //Function to Archive Chats
  async archivedConversations(req, res) {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    if (conversation.isArchived === false) {
      conversation.isArchived = true;
      await conversation.save();
      return ReS(res, "Conversation Archived");
    } else {
      conversation.isArchived = false;
      await conversation.save();
      return ReS(res, "Conversation UnArchived");
    }
  }

  //Function to broadcast a message
  async broadcast(req, res) {
    const id1 = req.body._id;
      const broadcastRecievers = await Conversation.find({
        _id: id1,
      }); // getting the array of conversations ids
      console.log(broadcastRecievers);

      if (!broadcastRecievers) {
        return ReE(res, "Cant broadcast", 400);
      }

      let broadcastMessage = []; //array containing list of selected Users

      for (let i = 0; i < broadcastRecievers.length; i++) {
        broadcastMessage.push(broadcastRecievers[i]._id);
      }

      const id = req.body.messages._id;
      const message = req.body.messages.message;
      let newMessage = {
        _id: id,
        message: message,
      };

      for (let i = 0; i < broadcastRecievers.length; i++) {
        broadcastRecievers[i].messages.push(newMessage);
        await broadcastRecievers[i].save();
      }

      while (broadcastRecievers.length > 0) {
        broadcastRecievers.pop();
      }
      await ReS(res, "Broadcast Succesful");
  }
}

module.exports = new conversation();
