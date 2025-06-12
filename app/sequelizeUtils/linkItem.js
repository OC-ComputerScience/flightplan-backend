import db from "../models/index.js";
const LinkItem = db.linkItem;

const exports = {};

exports.create = async (linkItemData) => {
  return await LinkItem.create(linkItemData);
};

exports.findAllForSection = async (sectionId) => {
  return await LinkItem.findAll({ where: { sectionId } });
};

exports.findOne = async (id) => {
  return await LinkItem.findByPk(id);
};

exports.update = async (linkItemData, id) => {
  return await LinkItem.update(linkItemData, { where: { id } });
};

exports.delete = async (id) => {
  return await LinkItem.destroy({ where: { id } });
};

export default exports;
