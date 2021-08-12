const Conversation = require("../Models/Conversation");
const { ReS, ReE } = require("../utils/responseService");
const mongoose = require("mongoose");

//let sender, reciever;

class conversation {
  //Method to create new Conversation
  async chat(req, res,next) {
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
    Conversation.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          messages: req.body.messages,
        },
      }
    )
      .then((messages) => {
        messages = req.body.messages;
        console.log(messages);
        res.status(201).json({ message: messages });
        console.log(req.body.messages, "req.body");
        console.log(result, "result");
      })
      .catch((error) => {
        res.status(500).json(error);
        console.log(error);
      });
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
  async getConversation(req,res,next) {
    const conversation = await Conversation.find({});

    if (conversation) {
      res.status(201).json(conversation);
    } else {
      return ReE(res, "Something Went Wrong", 400);
    }
    next();
  }
}

module.exports = new conversation();
