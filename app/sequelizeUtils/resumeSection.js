import db from "../models/index.js";
const { ResumeSection, Comment } = db;

const exports = {};

exports.findAllForResume = async (resumeId) => {
  return await ResumeSection.findAll({ where: { resumeId } });
};

exports.findAllForResumeWithComments = async (resumeId) => {
  return await ResumeSection.findAll({
    where: { resumeId },
    include: [
      { model: Comment, as: "comments", where: { status: "In-Review" } },
    ],
  });
};

exports.findOne = async (id) => {
  return await ResumeSection.findByPk(id);
};

exports.create = async (resumeSectionData) => {
  return await ResumeSection.create(resumeSectionData);
};

exports.update = async (resumeSectionData, id) => {
  return await ResumeSection.update(resumeSectionData, { where: { id } });
};

exports.delete = async (id) => {
  return await ResumeSection.destroy({ where: { id } });
};

export default exports;
