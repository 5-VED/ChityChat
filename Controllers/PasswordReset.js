const User = require("../Models/Users");
const Room = require("../Models/Rooms");
const Token = require("../Models/Token_Schema");
const { ReS, ReE } = require("../utils/responseService");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')

class ResetPassword {
  async resetPassword(req, res) {
    const { email } = req.body;

    User.findOne({ email }, async (error, user) => {
      //console.log(email);
      if (error || !user) {
        return ReS(res, "User with this account does not exist");
      }
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        await new Token({
          userId: user._id,
          token: crypto.randomBytes(64).toString("hex"),
        }).save();
      }
      console.log(token.token);
      let mailList = "webapp342@gmail.com";
      mailList.toString();

      let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 587,
        secure: true,
        auth: {
          user: process.env.SENDER,
          pass: process.env.PASSWORD,
        },
      });

      //console.log(transporter);

      let mailOptions = {
        from: process.env.SENDER,
        to: email,
        subject: "Password reset Link",
        html: `<h2> Please click on the below link to reset the password</h2>
             <p>${process.env.CLIENT_URL}/resetPassword/${user._id}/${token.token} </p>
           `,
      };

      //console.log(mailOptions);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return ReE(
            res,
            "Some Internal Server side error occured please try again later",
            400
          );
        } else {
          //     console.log('Hello');
          ReS(res, "Reset Password link send Please check");
        }
      });
    });
  }

  async newPassword(req, res) {
    try {
      console.log("HElo")
      const user = await User.findById(req.params.userId);
      if (!user) {
        return ReE(res,"No Such User Exist",400)
      }

      console.log(user);

      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });

      if (!token) {
        return ReE(res, "Invalid Link or its expired", 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password, salt);

      user.password = hashedpassword;
      await user.save();
      await token.delete();

      res.send("Password Reset Succesfully");
    } catch (error) {
      console.log(error);
    }
  }

  /*--------------------------------------------Function to reset group Password---------------------------------------------*/
  async resetRoomPassword(req, res) {
    const roomAdmin = await Room.findOne({ _id: req.body });
    if (!roomAdmin) {
      return ReE(res, "No such Group Exist", 400);
    }
    let adminId = roomAdmin.admin; //fetching the admin Id
    // console.log(adminId);
    const user = await User.findOne({ _id: adminId });
    const email = user.email;

    let token = await Token.findOne({ userId: user._id });
    console.log(token);
    if (!token) {
      await new Token({
        userId: user._id,
        token: crypto.randomBytes(64).toString("hex"),
      }).save();
    }
    console.log(token.token);
    let mailList = "webapp342@gmail.com";
    mailList.toString();

    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.SENDER,
        pass: process.env.PASSWORD,
      },
    });

    //console.log(transporter);

    let mailOptions = {
      from: process.env.SENDER,
      to: email,
      subject: "Password reset Link",
      html: `<h2> Please click on the below link to reset the password</h2>
           <p>${process.env.CLIENT_URL}/resetPassword/${user._id}/${token.token} </p>
         `,
    };

    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return ReE(res, error, 400);
      } else {
        console.log("Hello");
        ReS(res, "Reset Password link send Please check");
      }
    });
  }
}

module.exports = new ResetPassword();
