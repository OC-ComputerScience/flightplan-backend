import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Reward = SequelizeInstance.define("reward", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(255),
  },
  description: {
    type: Sequelize.STRING(255),
  },
  points: {
    type: Sequelize.INTEGER,
  },
  redemptionType: {
    type: Sequelize.STRING,
    // ENUM NEED TO BE DEFINED
  },
  redemptionInfo: {
    type: Sequelize.STRING(255),
  },
  imageName: {
    type: Sequelize.STRING(255),
  },
});

export default Reward;
