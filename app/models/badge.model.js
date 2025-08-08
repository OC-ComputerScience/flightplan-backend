import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Badge = SequelizeInstance.define("badge", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(255),
  },
  description: {
    type: Sequelize.STRING,
  },
  imageName: {
    type: Sequelize.STRING(255),
  },
  ruleType: {
    type: Sequelize.ENUM("Experiences and Tasks", "All Tasks and Experiences for Year", "All Tasks for Year", "Number of Tasks for Year", "Number of Badges", "Number of Tasks or Experiences for Year"),
    defaultValue: "Experiences and Tasks",
  },
  yearsFromGrad: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  completionQuantityOne: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  completionQuantityTwo: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: Sequelize.ENUM(
      "active", 
      "inactive"
    ),
    defaultValue: "active",
  }
});

export default Badge;
