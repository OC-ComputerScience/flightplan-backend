// models/eventStrength.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const EventStrength = SequelizeInstance.define(
  "eventstrength",
  {
    eventId: {
      type: Sequelize.INTEGER,
      references: {
        model: "event", // refers to events table
        key: "id",
      },
    },
    strengthId: {
      type: Sequelize.INTEGER,
      references: {
        model: "strengths", // refers to strengths table
        key: "id",
      },
    },
  },
  {
    tableName: "EventStrength", // Make sure the table name is correct
  },
);

export default EventStrength;
