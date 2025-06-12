import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Skill = SequelizeInstance.define("skill", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(45),
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING(45),
    allowNull: true,
  },
  proficiency_level: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
});

export default Skill;
