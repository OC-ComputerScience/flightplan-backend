import db from "../models/index.js";
const Strength = db.strength;

const exports = {};

exports.findAllStrengths = async () => {
  return await Strength.findAll();
};

exports.findAllStrengthsForUser = async () => {
  return await Strength.findAllForUser();
};

export default exports;
