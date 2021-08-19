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

    console.log(room);
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

  //Function to add member to the group/room
  async addMember(req, res) {
    //console.log("Fdd")

    const { _id } = req.body;
    User.findOne({ _id }, async (error, user) => {
      //console.log(_id);
      if (error || !user) {
        //console.log(user)
        return ReS(res, "User with this account does not exist");
      }
      let id = user._id.toString(); // initializing an id of the existing user
      //console.log(typeof(id))

      let newMember = await Room.findOne({ _id: req.params.id });

      if (!newMember) {
        console.log(newMember);
        return ReS(res, "sfsfs");
      }

      let arr = newMember.members; // initializing an array of a collection document

      console.log(arr[arr.length - 1]);
      console.log(id);
      if (arr[arr.length - 1] == id) {
        return ReE(res, "User Already there ", 400);
      }

      arr = arr.push(id); //Inserting a new user id in the collection

      await newMember.save();
      ReS(res, "Member Added Succesfully");
    });
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

  //Function to remove member from group
  async removeMember(req, res) {
    const member = await Room.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: { members: req.body.members },
      }
    );

    if (!member) {
      console.log(member);
      return ReE(res, "No such Chat Room Exist", 400);
    }
    await ReS(res, "User Removed Succesfully", 400);
  }
}
module.exports = new Rooms();
