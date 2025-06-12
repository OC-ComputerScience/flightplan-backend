import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const ResumeSection = SequelizeInstance.define("resumeSection", {
  section_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  section_type: {
    type: Sequelize.ENUM(
      "education",
      "experience",
      "project",
      "skill",
      "award",
      "link",
      "professional_summary",
    ),
    allowNull: false,
  },
  section_title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default ResumeSection;
