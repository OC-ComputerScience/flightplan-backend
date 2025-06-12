import db from "../models/index.js";
const ProfessionalSummaryItem = db.professionalSummaryItem;

const exports = {};

exports.create = async (professionalSummaryItemData) => {
  return await ProfessionalSummaryItem.create(professionalSummaryItemData);
};

exports.findAll = async () => {
  return await ProfessionalSummaryItem.findAll();
};

exports.findOne = async (id) => {
  return await ProfessionalSummaryItem.findByPk(id);
};

exports.update = async (professionalSummaryItemData, id) => {
  return await ProfessionalSummaryItem.update(professionalSummaryItemData, {
    where: { id },
  });
};

exports.delete = async (id) => {
  return await ProfessionalSummaryItem.destroy({ where: { id } });
};

export default exports;
