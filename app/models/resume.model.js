import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Resume = SequelizeInstance.define("resume", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  metadata: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

export default Resume;
