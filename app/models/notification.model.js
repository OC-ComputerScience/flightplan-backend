import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Notification = SequelizeInstance.define("notification", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  header: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  actionLink: {
    type: Sequelize.STRING,
  },
  read: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
});

export default Notification;
