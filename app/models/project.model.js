import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Project = SequelizeInstance.define("project", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(75),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(45),
  },
  date_start: {
    type: Sequelize.DATEONLY,
  },
  date_completed: {
    type: Sequelize.DATEONLY,
  },
});

export default Project;
