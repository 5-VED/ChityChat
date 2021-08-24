const Token = require("../Models/Token_Schema");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const doetnv = require("dotenv");
doetnv.config();

class passwordReset {
  async resetPasswordLink(req, res) {
    //console.log(user);
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      await new Token({
        userId: user._id,
        token: crypto.randomBytes(64).toString("hex"),
      }).save();
    }
    console.log(token.token);
    let mailList =  "webapp342@gmail.com";
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
  }
}
module.exports = new passwordReset();
