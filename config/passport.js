const User = require("../Models/Users"),
  Strategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const dotenv = require("dotenv");
dotenv.config();

module.exports = function (passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
    secretOrKey: process.env.TOKEN_SECRET,
  };

  //console.log("Obviously control comes here");
  passport.use(
    new Strategy(opts, function (jwt_payload, done) {
      //console.log("Obviously control comes here");
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
};

const authFxn = function (req, res, next) {
  console.log("Cant move ahead");
  passport.authenticate("jwt", function (err, user, info) {
    if (err) {
      console.log(err);
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


