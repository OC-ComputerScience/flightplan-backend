import db from "../models/index.js";
const WorkExperienceItem = db.workExperienceItem;

const exports = {};

exports.create = async (workExperienceItemData) => {
  return await WorkExperienceItem.create(workExperienceItemData);
};

exports.findAllForSection = async (sectionId) => {
  return await WorkExperienceItem.findAll({ where: { sectionId } });
};

exports.findOne = async (id) => {
  return await WorkExperienceItem.findByPk(id);
};

exports.update = async (workExperienceItemData, id) => {
  return await WorkExperienceItem.update(workExperienceItemData, {
    where: { id },
  });
};

exports.delete = async (id) => {
  return await WorkExperienceItem.destroy({ where: { id } });
};

export default exports;
