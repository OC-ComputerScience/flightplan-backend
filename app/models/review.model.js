import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Review = SequelizeInstance.define("review", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: Sequelize.ENUM(["in-review", "completed"]),
    allowNull: false,
    default: "in-review",
  },
  summary: {
    type: Sequelize.TEXT("long"),
    allowNull: true,
  },
  completedBy: {
    type: Sequelize.STRING,
  },
});

export default Review;
