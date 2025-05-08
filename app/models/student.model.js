import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Student = SequelizeInstance.define("student", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  graduationDate: {
    type: Sequelize.DATE,
  },
  pointsAwarded: {
    type: Sequelize.INTEGER,
  },
  pointsUsed: {
    type: Sequelize.INTEGER,
  },
  semestersFromGrad: {
    type: Sequelize.INTEGER,
  },
});

export default Student;
