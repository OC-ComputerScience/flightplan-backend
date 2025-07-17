import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Submission = SequelizeInstance.define("submission", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  submissionType: {
    type: Sequelize.ENUM("text", "file", "manual", "automatic"),
  },
  value: {
    type: Sequelize.TEXT("long"),
  },
});

export default Submission;
