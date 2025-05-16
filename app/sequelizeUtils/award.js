import db from "../models/index.js";
const Award = db.award;

const exports = {};

exports.create = async (awardData) => {
  try {
    const award = await Award.create(awardData);
    return award;
  } catch (error) {
    console.error("Error creating award:", error);
    throw new Error("Failed to create award");
  }
};

exports.findAllForUser = async (userId) => {
  try {
    const awards = await Award.findAll({ where: { userId: userId } });
    return awards;
  } catch (error) {
    console.error("Error finding awards for user:", error);
    throw new Error("Failed to find awards for user");
  }
};

exports.findOne = async (id) => {
  return await Award.findByPk(id);
};

exports.update = async (awardData, id) => {
  return await Award.update(awardData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await Award.destroy({ where: { id: id } });
};

export default exports;
