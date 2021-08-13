const User = require("../Models/Users"),
  Strategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");
dotenv.config();





module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
    secretOrKey: process.env.TOKEN_SECRET,
  };

  console.log("Obviously control comes here");
  passport.use(
    new Strategy(opts, function (jwt_payload, done) {
      console.log("Obviously control comes here");
      User.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );

  passport.use(new FacebookStrategy({

    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:"http://localhost:3001/facebook/callback",
    profileFields: ["name", "picture.type(large)", "email"],

  },//facebook will send back the token and profile));
  function(token,refreshToken , profile ,done) {
    console.log(token,refreshToken , profile )
    const user={}
    return done(null, user);
  }))
}

const authFxn = function (req, res, next) {
  passport.authenticate(["jwt","facebook"], function (err, user, info) {
    if (err) {
      res.json(err);
    }
    if (!user) {
      console.log("yes i am here");
      return res.json({ err: "Your Token is expire" });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
module.exports.authFxn = authFxn;
