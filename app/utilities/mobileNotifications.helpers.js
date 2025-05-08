import admin from "../authorization/firebase/firebase.js";

const exports = {};

// TODO
// xUpdate the DB to manage tokens
// Add the DeviceToken upon Login
// Remove the token upon logout
// Don't hardcode the device ID
// Clean code
// models/index.js is where the relationships are defined for Sequelize

exports.sendMobileNotification = async (deviceToken, title, body) => {
  if (deviceToken == null || deviceToken === "") {
    throw new Error("Device token is invalid");
  }

  const messaging = admin.messaging();
  await messaging.send({
    token: deviceToken,
    notification: {
      title: title,
      body: body,
    },
  });
};

export default exports;
