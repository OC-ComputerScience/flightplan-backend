import Sequelize from "sequelize";
import SequelizeInstance from "../../sequelizeUtils/sequelizeInstance.js";

const WorkExperienceItem = SequelizeInstance.define("workExperienceItem", {
  item_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

export default WorkExperienceItem;
