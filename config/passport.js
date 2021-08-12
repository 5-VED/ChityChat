const User = require("../Models/Users"),
  Strategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20");
dotenv.config();

passport.initialize();

module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
    secretOrKey: process.env.TOKEN_SECRET,
  };

  //console.log('Obviously control comes here');
  passport.use(
    new Strategy(opts, function (jwt_payload, done) {
      //console.log('Obviously control comes here');
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

  //   passport.use(
  //     new GoogleStrategy({
  //       //options for google start
  //     }),()=>{
  //       //passport callback funcion
  //     }
  //   )

  //   return passport.initialize();
  // };
};

const authFxn = function (req, res, next) {
  passport.authenticate("jwt", function (err, user, info) {
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
