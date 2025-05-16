import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const WorkExperience = SequelizeInstance.define("workExperience", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  employer: {
    type: Sequelize.STRING(75),
    allowNull: false,
  },
  position_title: {
    type: Sequelize.STRING(45),
    allowNull: false,
  },
  date_start: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  date_end: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
});

export default WorkExperience;
