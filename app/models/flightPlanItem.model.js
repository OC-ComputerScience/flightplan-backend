import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const FlightPlanItem = SequelizeInstance.define(
  "flightPlanItem",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    flightPlanItemType: {
      type: Sequelize.ENUM("Task", "Experience"),
    },
    status: {
      type: Sequelize.ENUM(
        "Complete",
        "Incomplete",
        "Pending",
        "Pending Attendance",
        "Awaiting Reflection",
        "Registered",
        "Rejected",
      ),
    },
    dueDate: {
      type: Sequelize.DATE,
    },
    name: {
      type: Sequelize.STRING(255),
    },
    optional: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    timestamps: true,
  },
);

export default FlightPlanItem;
