import Sequelize from "sequelize";
import SequelizeInstance from "../../sequelizeUtils/sequelizeInstance.js";

const ProfessionalSummaryItem = SequelizeInstance.define(
  "professionalSummaryItem",
  {
    item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
);

export default ProfessionalSummaryItem;
