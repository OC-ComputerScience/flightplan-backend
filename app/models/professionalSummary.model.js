import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const ProfessionalSummary = SequelizeInstance.define("professionalSummary", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  summary: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
});

export default ProfessionalSummary;
