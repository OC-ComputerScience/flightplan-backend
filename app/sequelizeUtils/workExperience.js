import db from "../models/index.js";
const WorkExperience = db.workExperience;

const exports = {};

exports.findAllForUser = async (userId) => {
  return await WorkExperience.findAll({ where: { userId: userId } });
};

exports.findOne = async (id) => {
  return await WorkExperience.findByPk(id);
};

exports.create = async (workExperienceData) => {
  return await WorkExperience.create(workExperienceData);
};

exports.update = async (workExperienceData, id) => {
  return await WorkExperience.update(workExperienceData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await WorkExperience.destroy({ where: { id: id } });
};

export default exports;
