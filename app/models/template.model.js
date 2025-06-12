import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Template = SequelizeInstance.define("template", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  template_data: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

export default Template;
