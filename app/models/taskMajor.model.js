import { Sequelize } from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const TaskMajor = SequelizeInstance.define(
  "taskMajor",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  },
);

export default TaskMajor;