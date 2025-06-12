import db from "../models/index.js";
const Skill = db.skill;

const exports = {};

exports.findAllForUser = async (userId) => {
  return await Skill.findAll({ where: { userId } });
};

exports.findOne = async (id) => {
  return await Skill.findByPk(id);
};

exports.create = async (skillData) => {
  return await Skill.create(skillData);
};

exports.update = async (skillData, id) => {
  return await Skill.update(skillData, { where: { id } });
};

exports.delete = async (id) => {
  return await Skill.destroy({ where: { id } });
};

export default exports;
