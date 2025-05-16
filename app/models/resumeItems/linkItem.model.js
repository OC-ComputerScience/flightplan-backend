import Sequelize from "sequelize";
import SequelizeInstance from "../../sequelizeUtils/sequelizeInstance.js";

const LinkItem = SequelizeInstance.define("linkItem", {
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

export default LinkItem;
