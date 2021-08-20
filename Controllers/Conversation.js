const Conversation = require("../Models/Conversation");
const Room = require("../Models/Rooms");
const User = require("../Models/Users");
const { ReS, ReE } = require("../utils/responseService");

class conversation {
  //Method to create new Conversation
  async chat(req, res, next) {
    const conversation = await new Conversation({
      //_id: new mongoose.Types.ObjectId(),
      //members: req.body.members,
      sender_id: req.body.sender_id,
      reciever_id: req.body.reciever_id,
      group_id: req.body.group_id,
      messages: req.body.messages,
    });
    conversation
      .save()
      .then((result) => {
        console.log(conversation);
        ReS(res, result);
        next();
        //res.status(201).json(result);
        //console.log(req.body.messages);
        //console.log(result, "result");
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
    console.log(conversaton);
    if (conversaton.group_id !== null) {
      const roomId = conversaton.group_id;

      const room = await Room.findOne({ _id: roomId }, async (error, room) => {
        if (!room || error) {
          return ReE(res, "No such Room Exist", 400);
        }
      });

      const id = req.body.messages._id;
      const message = req.body.messages.message;
      console.log(message);
      const arr = conversaton.messages;

      const pushFxn = function () {
        let newMessage = {
          _id: id,
          message: message,
        };
        arr.push(newMessage);
      };

      if (room.members.includes(id)) {
        console.log(id);
        pushFxn();
        conversaton.save();
        return ReS(res, "Message Send");
      }
      return ReE(res, "Wrong Group", 400);
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
    //    console.log(conversation)

    if (conversation <= 1) {
      next();
    } else {
      ReE(res, "Something Went Wrong", 400);
    }
  }

  //API to get Conversations
  async getConversation(req, res, next) {
    const conversation = await Conversation.find({});

    if (conversation) {
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

  //Api end for inserting Notifications in mongodb
  async notification(req, res) {
    const conversation = await Conversation.findOne({ _id: req.params.id });
    if (!conversation) {
      return ReE(res, "No such Conversation Exist", 400);
    }

    let arr = conversation.messages;
    let recieverId = conversation.reciever_id;
    console.log(recieverId);
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

module.exports = new conversation();
