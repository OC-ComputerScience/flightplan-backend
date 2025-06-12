import db from "../models/index.js";
const Project = db.project;

const exports = {};

exports.findAllForUser = async (userId) => {
  return await Project.findAll({ where: { userId: userId } });
};

exports.findOne = async (id) => {
  return await Project.findByPk(id);
};

exports.create = async (projectData) => {
  return await Project.create(projectData);
};

exports.update = async (projectData, id) => {
  return await Project.update(projectData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await Project.destroy({ where: { id: id } });
};

export default exports;
