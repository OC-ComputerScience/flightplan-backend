import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Link = SequelizeInstance.define("link", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  websiteName: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  link: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

export default Link;
