// models/experienceStrength.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const ExperienceStrength = SequelizeInstance.define(
  "experiencestrength",
  {
    experienceId: {
      type: Sequelize.INTEGER,
      references: {
        model: "experience", // refers to experiences table
        key: "id",
      },
    },
    strengthId: {
      type: Sequelize.INTEGER,
      references: {
        model: "strengths", // refers to strengths table
        key: "id",
      },
    },
  },
  {
    tableName: "ExperienceStrength", // Make sure the table name is correct
  },
);

export default ExperienceStrength;
