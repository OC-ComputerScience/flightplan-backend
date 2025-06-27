import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Event = SequelizeInstance.define("event", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(100),
  },
  location: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING(2000),
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Default as now
  },
  startTime: {
    type: Sequelize.DATE,
  },
  endTime: {
    type: Sequelize.DATE,
  },
  attendanceType: {
    type: Sequelize.ENUM("In Person", "Virtual"),
    // ENUM NEED TO BE DEFINED
  },
  registration: {
    type: Sequelize.ENUM("In App", "Handshake"),
  },
  status: {
    type: Sequelize.ENUM("Upcoming", "Completed", "Cancelled"),
    defaultValue: "Upcoming",
  },
});

export default Event;