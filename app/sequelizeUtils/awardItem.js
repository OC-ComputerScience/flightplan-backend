import db from "../models/index.js";
const AwardItem = db.awardItem;

const exports = {};

exports.create = async (awardItemData) => {
  return await AwardItem.create(awardItemData);
};

exports.findAllForSection = async (sectionId) => {
  return await AwardItem.findAll({ where: { sectionId } });
};

exports.findOne = async (id) => {
  return await AwardItem.findByPk(id);
};

exports.update = async (awardItemData, id) => {
  return await AwardItem.update(awardItemData, { where: { id } });
};

exports.delete = async (id) => {
  return await AwardItem.destroy({ where: { id } });
};

export default exports;
