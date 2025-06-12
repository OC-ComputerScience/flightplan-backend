import db from "../models/index.js";
const EducationItem = db.educationItem;

const exports = {};

exports.create = async (educationItemData) => {
  return await EducationItem.create(educationItemData);
};

exports.findAllForSection = async (sectionId) => {
  return await EducationItem.findAll({ where: { sectionId } });
};

exports.findOne = async (id) => {
  return await EducationItem.findByPk(id);
};

exports.update = async (educationItemData, id) => {
  return await EducationItem.update(educationItemData, { where: { id } });
};

exports.delete = async (id) => {
  return await EducationItem.destroy({ where: { id } });
};

export default exports;
