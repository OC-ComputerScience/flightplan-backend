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
    type: Sequelize.ENUM("In-Person", "Digital"),
    defaultValue: "Digital",
  },
  redemptionInfo: {
    type: Sequelize.STRING(255),
  },
  imageName: {
    type: Sequelize.STRING(255),
  },
  quantityAvaliable: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM("Active", "Inactive"),
    defaultValue: "Active",
  }
});

export default Reward;
