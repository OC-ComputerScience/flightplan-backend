import db from "../models/index.js";
const Template = db.template;

const exports = {};

exports.findOne = async (id) => {
  return await Template.findByPk(id);
};

export default exports;
