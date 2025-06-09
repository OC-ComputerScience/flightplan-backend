// models/studentMajor.model.js

import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const StudentMajor = SequelizeInstance.define(
  "studentmajor",
  {
    studentId: {
      type: Sequelize.INTEGER,
      references: {
        model: "students", // refers to students table
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
    tableName: "StudentMajor", // Make sure the table name is correct
  },
);

export default StudentMajor;
