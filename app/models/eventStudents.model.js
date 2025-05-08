// EventStudents.model.js
import { Sequelize } from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const EventStudents = SequelizeInstance.define("EventStudents", {
  eventId: {
    type: Sequelize.INTEGER,
    references: {
      model: "events",
      key: "id",
    },
  },
  studentId: {
    type: Sequelize.INTEGER,
    references: {
      model: "students",
      key: "id",
    },
  },
  attended: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  recordedTime: {
    type: Sequelize.DATE,
    defaultValue: new Date(),
  },
});

// Export the model
export default EventStudents;
