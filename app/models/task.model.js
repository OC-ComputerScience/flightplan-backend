import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Task = SequelizeInstance.define("task", {
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
  schedulingType: {
    type: Sequelize.ENUM(
      "one-time",
      "every-semester",
      "optional",
      "every-other-semester",
    ),
  },
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING(2000),
  },
  rationale: {
    type: Sequelize.STRING,
  },
  semestersFromGrad: {
    type: Sequelize.INTEGER,
  },
  submissionType: {
    type: Sequelize.ENUM("Reflection - Review", "Reflection - Auto Approve", "Upload Document - Review", "Upload Document - Auto Approve", "Upload Document & Reflection - Review",  "Upload Document & Reflection - Auto Approve", "Manual Review", "Self-Appointed", "Auto Complete - Major", "Auto Complete - LinkedIn", "Auto Complete - Handshake", "Auto-Complete - Strengths", "text", "files", "both", "manual"),
    defaultValue: "manual",
  },
  points: {
    type: Sequelize.INTEGER,
  },
});

export default Task;
