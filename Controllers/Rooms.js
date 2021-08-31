const Room = require("../Models/Rooms");
const { ReE, ReS } = require("../utils/responseService");
const bcrypt = require("bcrypt");
const _ = require("lodash");

class Rooms {
  //Function to create a new room
  async newRoom(req, res) {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    const room = await new Room({
      name: req.body.name,
      image: req.file.path,
      password: hashedpassword,
      members: req.body.members,
    });

    //    console.log(room);
    try {
      await room.save();
      ReS(res, "New Group created");
    } catch (error) {
      console.log(error);
      ReE(res, "Some error Occured", 400);
    }
  }

  /*--------------------------------------Function to add member to the group/room---------------------------------*/
  async addMember(req, res) {
    const room = await Room.findOne({ _id: req.params.id });
    if (!room) {
      return ReE(res, "No Such Room Exist", 400);
    }

    const members = room.members;
    const membersId = req.body.members;
    //console.log(membersId);
    const admin = req.body.admin;

    if (_.some(room.members, admin)) {
      // console.log(_.some(room.members, admin));
      for (let i = 0; i < membersId.length; i++) {
        let obj = {};
        obj["isAdmin"] = membersId[i].isAdmin;
        obj["_id"] = membersId[i]._id;
        // console.log(!_.find(room.members, membersId[i]));
        // console.log(room.members,membersId[i])
        if (
          !_.find(room.members, membersId[i]) &&
          membersId[i].isAdmin === false
        ) {
          members.push(obj);
          console.log(obj);
        } else {
          console.log(obj);
          // console.log(membersId[0]);
          return ReE(res, "You are already in the group", 400);
        }
      }
      await room.save();
      ReS(res, "You Are Added Succesfully");
    } else {
      return;
    }
  }

  /*---------------------------------------Fuction to delet room from collection---------------------------------*/

  async deleteRoom(req, res) {
    const room = await Room.findOne({ _id: req.params.id });

    console.log(room);
    console.log(room.isDelete);
    if (!room) return ReE(res, "Record doesnt exist", 400);
    try {
      if (room.isDelete === false) {
        room.isDelete = true;
        await room.save();
        return ReS(res, "Room Deleted Succesfully");
      }
    } catch (err) {
      return ReS(res, err, 400);
    }
  }

  /*---------------------------------------Function to update group/room--------------------------------------------*/
  async updateRoom(req, res) {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const room = await new Room({
      _id: req.params.id,
      name: req.body.name,
      image: req.file.path,
      password: hashedpassword,
      members: req.body.members,
      isDelete: req.body.isDelete,
    });
    console.log(room);
    Room.updateOne(
      {
        _id: req.params.id,
      },
      room
    )
      .then(ReS(res, "Record Updated Succesfully"))
      .catch(ReE(res, "Please try again Later", 400));
  }

  /*---------------------------------------Function to get member to the group/room---------------------------------*/
  async getRoom(req, res) {
    const getRoom = await Room.findOne({
      _id: req.params.id,
    });

    if (!getRoom) {
      ReE(res, "Group does not exist", 400);
    } else {
      ReS(res, getRoom);
    }
  }

  /*---------------------------------------Function to remove member to the group/room---------------------------------*/
  async removeMember(req, res) {
    const room = await Room.findOne({ _id: req.params.id });
    if (!room) return ReE(res, "Record doesnt exist", 400);

    let members = room.members;
    const id = req.body.removeMembers._id;
    const adminFlag = req.body.removeMembers.isAdmin;

    let obj = {};
    obj["isAdmin"] = adminFlag;
    obj["_id"] = id;

    let temp = [];
    for (let i = 0; i < members.length; i++) {
      let obj = {};
      obj["isAdmin"] = members[i].isAdmin;
      obj["_id"] = members[i]._id;
      temp.push(obj);
    }

    let index = _.indexOf(temp, _.find(temp, obj), 0);
    members.splice(index, 1);
    await room.save();
    return ReS(res, "Member Removed Succesfully");
  }
  /*---------------------------------------Function to add admin to the group/room---------------------------------------*/
  async addAdmin(req, res) {
    const room = await Room.findOne({ _id: req.params.id });

    if (!room) {
      return ReE(res, "No Such Group Exist", 400);
    }
    const members = room.members;
    const id = req.body._id;

    for (let i = 0; i < members.length; i++) {
      if (members[i]._id === id) {
        if (members[i].isAdmin === false) {
          members[i].isAdmin = true;
        }
      }
    }
    await room.save();
    return ReS(res, "You are Now Admin");
  }

  /*---------------------------------------Function to dismisss Admin from the group/room---------------------------------*/

  async dismissAdmin(req, res) {
    const room = await Room.findOne({ _id: req.params.id });

    if (!room) {
      return ReE(res, "No Such Group Exist", 400);
    }

    const members = room.members;
    const id = req.body._id;

    for (let i = 0; i < members.length; i++) {
      if (members[i]._id === id) {
        if (members[i].isAdmin === true) {
          members[i].isAdmin = false;
        }
      }
    }
    await room.save();
    return ReS(res, "You are no More Admin");
  }
}

module.exports = new Rooms();
