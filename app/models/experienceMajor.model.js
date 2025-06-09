// models/experienceMajor.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const ExperienceMajor = SequelizeInstance.define(
  "experiencemajor",
  {
    experienceId: {
      type: Sequelize.INTEGER,
      references: {
        model: "experience", // refers to experiences table
        key: "id",
      },
    },
    majorId: {
      type: Sequelize.INTEGER,
      references: {
        model: "majors", // refers to majors table
        key: "id",
      },
    },
  },
  {
    tableName: "ExperienceMajor", // Make sure the table name is correct
  },
);

export default ExperienceMajor;