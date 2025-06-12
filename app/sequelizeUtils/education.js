import db from "../models/index.js";
const Education = db.education;

const exports = {};

exports.findAllForUser = async (userId) => {
  return await Education.findAll({ where: { userId: userId } });
};

exports.findOne = async (id) => {
  return await Education.findByPk(id);
};

exports.update = async (educationData, id) => {
  return await Education.update(educationData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await Education.destroy({ where: { id: id } });
};

export default exports;
