import db from "../models/index.js";
const ProjectItem = db.projectItem;

const exports = {};

exports.create = async (projectItemData) => {
  return await ProjectItem.create(projectItemData);
};

exports.findAllForSection = async (sectionId) => {
  return await ProjectItem.findAll({ where: { sectionId } });
};

exports.findOne = async (id) => {
  return await ProjectItem.findByPk(id);
};

exports.update = async (projectItemData, id) => {
  return await ProjectItem.update(projectItemData, { where: { id } });
};

exports.delete = async (id) => {
  return await ProjectItem.destroy({ where: { id } });
};

export default exports;
