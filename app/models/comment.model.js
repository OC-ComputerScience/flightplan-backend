import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Comment = SequelizeInstance.define("comment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
});

export default Comment;
