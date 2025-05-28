import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Education = SequelizeInstance.define("education", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  institution: {
    type: Sequelize.STRING(75),
    allowNull: false,
  },
  credential_earned: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  date_from: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  date_to: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  gpa: {
    type: Sequelize.STRING(25),
    allowNull: false,
  },
  coursework: {
    type: Sequelize.STRING,
  },
});

export default Education;
