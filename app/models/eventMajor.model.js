// models/eventMajor.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const EventMajor = SequelizeInstance.define(
  "eventmajor",
  {
    eventId: {
      type: Sequelize.INTEGER,
      references: {
        model: "event", // refers to events table
        key: "id",
      },
    },
    majorId: {
      type: Sequelize.INTEGER,
      references: {
        model: "majors", // refers to majors table
        key: "id",
      },
    },
  },
  {
    tableName: "EventMajor", // Make sure the table name is correct
  },
);

export default EventMajor;
