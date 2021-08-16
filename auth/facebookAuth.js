const User = require("../Models/Users"),
const FacebookStrategy = require("passport-facebook").Strategy;
const { FACEBOOK_CONFIG } = require("../config/config");
const passport = require('passport')

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(FACEBOOK_CONFIG, function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    console.log(accessToken,refreshToken,profile);
    console.log("In Fb")
    const user = {};
  return done(null, user);
  })
);

