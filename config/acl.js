let ACL = require("acl");
const MongodbBackend = ACL.mongodbBackend;
const aclConfiguration = {
  ACL: (dbConnection) => {
    const backend = new MongodbBackend(dbConnection, "acl_");
    const acl = new ACL(backend);

    //Set Roles
    acl.allow([
      {
        roles: "groupAdmin",
        allows: [
          {
            resources: [
              "/addMember/:id", //Authority to add Member
              "removeMember/:id", //Authority to remove Member
              "/deleteRoom/:id", //Authority to delete room
              "/clearChat/:id", //Authority to clear chat
              "/newPassword/:userId/:token", // verify the Link and reset the password
              "/resetRoomPassword", // Sends the password Reset Link to the group Admin"
            ],
            permissions: "*",
          },
        ],
      },
    ]);
  },
};

module.exports = aclConfiguration;
