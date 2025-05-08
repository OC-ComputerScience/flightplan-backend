import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const User = SequelizeInstance.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  lName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  fullName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  profileDescription: {
    type: Sequelize.STRING(255),
  },
});

export default User;
