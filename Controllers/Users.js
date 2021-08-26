const User = require("../Models/Users");
const { ReS, ReE } = require("../utils/responseService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class Users {
  //Function to create User
  async createUser(req, res) {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(400).json({ error: "Email Id Already Exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      image: req.file.path,
      bio: req.body.bio,
      email: req.body.email,
      password: hashedpassword,
    });

    try {
      const savedUser = await user.save();
      console.log(savedUser);
      ReS(res, savedUser);
    } catch (error) {
      ReE(res, error, 400);
    }
  }

  //APi to login a user
  async login(req, res) {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(validPassword);
      if (validPassword) {
        console.log(validPassword);
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
        res.send({ user: user._id, token: token });
      } else {
        ReE(res, "Invalid Password", 400);
      }
    }

    if (!user) {
      ReE(res, "Email adress doent exist", 400);
    }
  }

  //Function to update a User
  async updateUser(req, res) {
    if (req.file) {
      console.log(req.file);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const user = await new User({
      _id: req.params.id,
      name: req.body.name,
      image: req.file.path,
      bio: req.body.bio,
      email: req.body.email,
      password: hashedpassword,
    });

    User.updateOne(
      {
        _id: req.params.id,
      },
      user
    )
      .then(ReS(res, "Recored updated succesfully"))
      .catch(ReE(res, "Record doesnt exist", 400));
  }

  //Functin to get all Users
  async getUser(req, res) {
    const user = await User.find();
    if (user) {
      ReS(res, user);
    } else {
      ReE(res, "Something went wrong", 400);
    }
  }

  //Function to delete a user
  async deleteUser(req, res) {
    const user = await User.findOne({ _id: req.params.id });
    //console.log(user)
    if (!user) return ReE(res, "Record doesnt exist", 400);
    User.deleteOne(
      {
        _id: req.params.id,
      },
      user
    ).then(ReS(res, "User Deleted succesfully"));
  }
}

module.exports = new Users();
