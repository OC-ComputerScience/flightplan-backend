import db from "../models/index.js";
const SkillItem = db.skillItem;

const exports = {};

exports.create = async (skillItemData) => {
  return await SkillItem.create(skillItemData);
};

exports.findAllForSection = async (sectionId) => {
  return await SkillItem.findAll({ where: { sectionId } });
};

exports.findOne = async (id) => {
  return await SkillItem.findByPk(id);
};

exports.update = async (skillItemData, id) => {
  return await SkillItem.update(skillItemData, { where: { id } });
};

exports.delete = async (id) => {
  return await SkillItem.destroy({ where: { id } });
};

export default exports;
