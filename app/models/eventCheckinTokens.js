import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Event = SequelizeInstance.define("eventCheckinTokens", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: Sequelize.STRING,
  },
  expirationTimestamp: {
    type: Sequelize.DATE,
  },
});

export default Event;
