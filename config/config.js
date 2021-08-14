module.exports = {
  FACEBOOK_CONFIG: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/facebook/callback",
    profileFields: ["name", "picture.type(large)", "email"],
  },
};
