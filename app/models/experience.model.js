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
    type: Sequelize.ENUM("Reflection - Review", "Reflection - Auto Approve", "Attendance - Reflection", "Attendance - Auto Approve", "Upload Document - Review", "Upload Document - Auto Approve", "Upload Document & Reflection - Review",  "Upload Document & Reflection - Auto Approve", "Manual Review", "Self-Approved", "text", "files", "both", "attendance"),
    default: "attendance",
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
    type: Sequelize.ENUM(
      "active",
      "inactive"
    ),
    defaultValue: "active",
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
    type: Sequelize.STRING(255),
  },
  points: {
    type: Sequelize.INTEGER,
  },
  sequenceNumber: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

export default Experience;
