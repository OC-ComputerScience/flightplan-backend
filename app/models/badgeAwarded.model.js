import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const BadgeAwarded = SequelizeInstance.define(
  "badgeAwarded",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: Sequelize.DATE,
    },
    badgeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "badges", // Referring to the Badge table
        key: "id", // Referencing the id column in Badge
      },
    },
    studentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "students", // Referring to the Student table
        key: "id", // Referencing the id column in Student
      },
    },
    viewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "BadgeAwarded", // Make sure the table name is correct
  },
);

export default BadgeAwarded;
