// models/studentStrength.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const StudentStrength = SequelizeInstance.define(
  "studentstrength",
  {
    studentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "students", // refers to students table
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
    tableName: "StudentStrength", // Make sure the table name is correct
  },
);

export default StudentStrength;
