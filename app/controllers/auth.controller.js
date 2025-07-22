import db from "../models/index.js";
import authconfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { auth } from "../authorization/firebase/firebase.js";

const User = db.user;
const Role = db.role;
const Session = db.session;
const Op = db.Sequelize.Op;

import { google } from "googleapis";

const exports = {};

const verifyFirebaseToken = async (idToken) => {
  const decoded = await auth.verifyIdToken(idToken);
  const email = decoded.email;
  const nameParts = decoded.name?.split(" ") || [];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";

  return { email, firstName, lastName };
};

const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const email = payload.email;
  const firstName = payload.given_name;
  const lastName = payload.family_name;

  return { email, firstName, lastName };
};

const getUserInfoFromAccessToken = async (accessToken) => {
  try {
    const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    
    return {
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  } catch (error) {
    console.error("Failed to retrieve user info with access token:", error);
    return null;
  }
};

exports.login = async (req, res) => {
  try {
    const {
      credential: idToken,
      accessToken,
      clientType = "google",
    } = req.body;

    if (!idToken) {
      return res.status(400).send({ message: "Missing token" });
    }

    let userInfo;
    try {
      if (clientType === "firebase") {
        userInfo = await verifyFirebaseToken(idToken);
      } else if (clientType === "google") {
        userInfo = await verifyGoogleToken(idToken);
      } else {
        return res
          .status(400)
          .send({ message: "Invalid client type specified" });
      }
    } catch (error) {
      console.error(`${clientType} token verification failed:`, error.message);
      return res.status(401).send({ message: "Invalid token" });
    }

    // If we're missing any user info and have an access token, try to get it
    if (
      (!userInfo.email || !userInfo.firstName || !userInfo.lastName) &&
      accessToken
    ) {
      const accessTokenInfo = await getUserInfoFromAccessToken(accessToken);
      if (accessTokenInfo) {
        userInfo = {
          email: userInfo.email || accessTokenInfo.email,
          firstName: userInfo.firstName || accessTokenInfo.firstName,
          lastName: userInfo.lastName || accessTokenInfo.lastName,
        };
      }
    }

    if (!userInfo.email) {
      return res.status(400).send({ message: "Unable to retrieve email" });
    }

    const { email, firstName, lastName } = userInfo;
    const fullName = `${firstName} ${lastName}`.trim();
  

    let user = await User.findOne({
      where: { email },
      include: { model: Role },
    });

    if (!user) {
      user = await User.create({
        fName: firstName,
        lName: lastName,
        email,
        fullName,
      });
      
    } else {
      await user.update({
        fName: firstName,
        lName: lastName,
        fullName,
      });
    
    }

    // Handle session
    let session = await Session.findOne({
      where: { email, token: { [Op.ne]: "" } },
    });

    if (session && session.expirationDate < new Date()) {
      await session.update({ token: "" });
      session = null;
    }

    if (!session) {
      const token = jwt.sign({ id: email }, authconfig.secret, {
        expiresIn: 86400,
      });
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      session = await Session.create({
        token,
        email,
        userId: user.id,
        expirationDate,
      });
    }

    const userInfoObj = {
      email: user.email,
      fName: user.fName,
      lName: user.lName,
      fullName: user.fullName,
      userId: user.id,
      token: session.token,
    };

    
    return res.send(userInfoObj);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

exports.authorize = async (req, res) => {
 
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "postmessage",
  );


  // Get access and refresh tokens (if access_type is offline)
  let { tokens } = await oauth2Client.getToken(req.body.code);
  oauth2Client.setCredentials(tokens);

  let user = {};


  await User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data != null) {
        user = data.dataValues;
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
      return;
    });

  user.refresh_token = tokens.refresh_token;
  let tempExpirationDate = new Date();
  tempExpirationDate.setDate(tempExpirationDate.getDate() + 100);
  user.expiration_date = tempExpirationDate;

  await User.update(user, { where: { id: user.id } })
    .then((num) => {
      if (num == 1) {
        console.log("updated user's google token stuff");
      } else {
        console.log(
          `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`,
        );
      }
      let userInfo = {
        refresh_token: user.refresh_token,
        expiration_date: user.expiration_date,
      };
     
      res.send(userInfo);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });


};

exports.logout = async (req, res) => {

  if (req.body === null) {
    res.send({
      message: "User has already been successfully logged out!",
    });
    return;
  }

  // invalidate session -- delete token out of session table
  let session = {};

  await Session.findAll({ where: { token: req.body.token } })
    .then((data) => {
      if (data[0] !== undefined) session = data[0].dataValues;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions.",
      });
      return;
    });

  session.token = "";

  // session won't be null but the id will if no session was found
  if (session.id !== undefined) {
    Session.update(session, { where: { id: session.id } })
      .then((num) => {
        if (num == 1) {
          
          res.send({
            message: "User has been successfully logged out!",
          });
        } else {
          console.log("failed logging out user");
          res.send({
            message: `Error logging out user.`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error logging out user.",
        });
      });
  } else {
   
    res.send({
      message: "User has already been successfully logged out!",
    });
  }
};

exports.validateToken = async (req, res) => {
  if (req.body.token === undefined || req.body.token === "") {
    res.status(401).send({
      message: "Token missing or invalid. Please provide a valid token.",
      isValid: false,
    });
    return;
  }

  // Check if the token exists in the session table
  let session = {};

  await Session.findOne({ where: { token: req.body.token } })
    .then((data) => {
      if (data !== null) {
        session = data.dataValues;
        if (session.expirationDate > Date.now()) {
          res.status(200).send({
            message: "Valid token.",
            isValid: true,
          });
        } else {
          res.status(401).send({
            message: "Token has expired.",
            isValid: false,
          });
        }
      } else {
        res.status(401).send({
          message: "Invalid token. Please provide a valid token.",
          isValid: false,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Error occurred while retrieving session.",
        isValid: false,
      });
    });
};

export default exports;
