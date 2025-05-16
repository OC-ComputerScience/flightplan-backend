import db from "../models/index.js";
const ProfessionalSummary = db.professionalSummary;

const exports = {};

exports.findAllForUser = async (userId) => {
  return await ProfessionalSummary.findAll({ where: { userId: userId } });
};

exports.findOne = async (id) => {
  return await ProfessionalSummary.findByPk(id);
};

exports.findForResume = async (resumeId) => {
  return await ProfessionalSummary.findOne({ where: { resumeId: resumeId } });
};

exports.create = async (professionalSummaryData) => {
  return await ProfessionalSummary.create(professionalSummaryData);
};

exports.update = async (professionalSummaryData, id) => {
  return await ProfessionalSummary.update(professionalSummaryData, {
    where: { id: id },
  });
};

exports.delete = async (id) => {
  return await ProfessionalSummary.destroy({ where: { id: id } });
};

export default exports;
