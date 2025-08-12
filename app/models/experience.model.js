import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Experience = SequelizeInstance.define("experience", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: Sequelize.ENUM(
      "Academic",
      "Leadership",
      "Networking",
      "Strengths",
      "Career Prep",
      "Mentoring",
      "Volunteer",
    ),
  },
  submissionType: {
    type: Sequelize.ENUM(
      "Attendance - Auto Approve",
      "Attendance - Reflection - Auto Approve",
      "Attendance - Document - Auto Approve",
      "Attendance - Reflection - Review",
      "Attendance - Document - Review",
      "Reflection - Review",
      "Reflection - Auto Approve",
      "Upload Document - Review",
      "Upload Document - Auto Approve",
      "Self-Approved",
    ),
    default: "Attendance - Auto Approve",
  },
  reflectionRequired: {
    type: Sequelize.BOOLEAN,
  },
  schedulingType: {
    type: Sequelize.ENUM(
      "one-time",
      "every-semester",
      "optional",
      "every-other-semester",
    ),
  },
  status: {
    type: Sequelize.ENUM("active", "inactive"),
    defaultValue: "active",
  },
  eventRequired: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  semestersFromGrad: {
    type: Sequelize.INTEGER,
  },
  semesterEnd: {
    type: Sequelize.INTEGER,
  },
  description: {
    type: Sequelize.STRING(2000),
  },
  name: {
    type: Sequelize.STRING(255),
  },
  rationale: {
    type: Sequelize.STRING(2000),
  },
  points: {
    type: Sequelize.INTEGER,
  },
  sequenceNumber: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  instructions: {
    type: Sequelize.STRING,
  },
  instructionsLink: {
    type: Sequelize.STRING,
  },
});

export default Experience;