const Room = require("../Models/Rooms");
const { ReE, ReS } = require("../utils/responseService");
const bcrypt = require("bcrypt");
const User = require("../Models/Users");

class Rooms {
  //Function to create a new room
  async newRoom(req, res) {
    const salt = await bcrypt.genSalt(10);
    let hashedpassword = await bcrypt.hash(req.body.password, salt);

    const room = await new Room({
      password: hashedpassword,
      members: req.body.members,
    });

    try {
      if (room.members.length == 0 || room.members == " ") {
        console.log(room);
        return ReE(res, "Can't create a room Plese try Again ", 400);
      }

      //Filter to prevent duplicate entries in the group/room
      for (let i = 0; i < room.members.length; i++) {
        let temp = room.members[i];
        for (let j = i + 1; j < room.members.length - 1; j++) {
          if (temp == room.members[j]) {
            return ReE(res, "Invalid id please try again", 400);
          }
        }
      }

      await room.save();
      ReS(res, "New Group created");
    } catch (error) {
      ReE(res, "Some error Occured", 400);
    }
  }

  //Function to add member to the group/room
  async addMember(req, res) {
    //console.log("Fdd");

    const newMember = await Room.updateOne(
      {
        _id: req.params.id,
      },
      {
        members: req.body.members,
      }
    );
    console.log(newMember.members);

    if (!newMember || newMember == "undefined") {
      console.log("FFF");
      return ReE(res, "Group does not exist", 400);
    } else {
      let members = new Array();
      members = members.push(newMember.members);
      console.log(newMember.members);
      ReS(res, "New Member Added Succesfully");
    }
  }

  //Function to get member to the group/room
  async getRoom(req, res) {
    const getRoom = await Room.findOne({
      _id: req.params.id,
    });

    if (!getRoom) {
      ReE(res, "Group does not exist", 400);
    } else {
      //console.log(getRoom); //[]
      ReS(res, getRoom);
    }
  }

  //Fuction to delet room from collection
  async deleteRoom(req, res) {
    const room = await Room.findOne({ _id: req.params.id });

    if (!room) return ReE(res, "Record doesnt exist", 400);
    Room.deleteOne(
      {
        _id: req.params.id,
      },
      room
    ).then(ReS(res, "Room Deleted succesfully"));
  }
}

module.exports = new Rooms();
