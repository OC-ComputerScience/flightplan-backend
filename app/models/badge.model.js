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
    type: Sequelize.ENUM("Task and Experience Defined"),
    defaultValue: "Task and Experience Defined",
  },
});

export default Badge;
