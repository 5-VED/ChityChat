module.exports = {
  FACEBOOK_CONFIG: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    profileFields: ["name", "picture.type(large)", "email"],
  },
};
