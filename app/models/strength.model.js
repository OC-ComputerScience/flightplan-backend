import Sequelize from "sequelize";
import SequelizeInstance from "../sequelizeUtils/sequelizeInstance.js";

const Strength = SequelizeInstance.define("strength", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.ENUM(
      "Achiever",
      "Discipline",
      "Arranger",
      "Focus",
      "Belief",
      "Responsibility",
      "Consistency",
      "Restorative",
      "Deliberative",
      "Activator",
      "Maximizer",
      "Command",
      "Self-Assurance",
      "Communication",
      "Significance",
      "Competition",
      "Woo",
      "Adaptability",
      "Includer",
      "Connectedness",
      "Individualization",
      "Developer",
      "Positivity",
      "Empathy",
      "Relator",
      "Harmony",
      "Analytical",
      "Input",
      "Context",
      "Intellection",
      "Futuristic",
      "Learner",
      "Ideation",
      "Strategic",
    ),
  },
  domain: {
    type: Sequelize.ENUM(
      "Executing",
      "Influencing",
      "Relationship Building",
      "Strategic Planning",
    ),
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  number: {
    type: Sequelize.INTEGER,
  },
});

export default Strength;
