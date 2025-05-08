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
    type: Sequelize.STRING,
  },
  rationale: {
    type: Sequelize.STRING,
  },
  semestersFromGrad: {
    type: Sequelize.INTEGER,
  },
  submissionType: {
    type: Sequelize.ENUM("text", "files", "both"),
    defaultValue: "text",
  },
  points: {
    type: Sequelize.INTEGER,
  },
});

export default Task;
