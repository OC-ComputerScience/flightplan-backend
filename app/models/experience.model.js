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
    type: Sequelize.ENUM("Reflection - Review", "Reflection - Auto Approve", "Attendance - Reflection", "Attendance - Auto Approve", "Upload Document - Review", "Upload Document - Auto Approve", "Upload Document & Reflection - Review",  "Upload Document & Reflection - Auto Approve", "Manual Review", "Self-Appointed", "text", "files", "both", "attendance"),
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
  semestersFromGrad: {
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
});

export default Experience;
