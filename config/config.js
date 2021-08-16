module.exports = {
  FACEBOOK_CONFIG: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://3001/api/auth/facebook/callback",
    profileFields: ["name", "picture.type(large)", "email"],
  },
};
