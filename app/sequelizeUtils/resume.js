import db from "../models/index.js";
const Resume = db.resume;
const ResumeSection = db.resumeSection;
const Template = db.template;
const User = db.user;
const Review = db.review;
const Op = db.Sequelize.Op;

const exports = {};

exports.create = async (resumeData) => {
  return await Resume.create(resumeData);
};

exports.update = async (resumeData, id) => {
  return await Resume.update(resumeData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await Resume.destroy({ where: { id: id } });
};

exports.findAllForUser = async (userId) => {
  return await Resume.findAll({ where: { userId: userId } });
};

exports.findOne = async (id) => {
  return await Resume.findByPk(id, {
    include: [
      { model: ResumeSection, as: "resumeSection" },
      { model: Template, required: true, as: "template" },
    ],
  });
};

exports.findForReview = async (searchQuery = "") => {
  const searchTerms = searchQuery
    .split(" ")
    .filter((term) => term.trim() !== "");

  return await Resume.findAll({
    include: [
      { model: Review, as: "review", where: { status: "In-Review" } },
      {
        model: User,
        as: "user",
        attributes: ["fName", "lName"],
        where: searchQuery
          ? {
              [Op.or]: [
                // Match full name concatenation
                {
                  [Op.and]: searchTerms.map((term) => ({
                    [Op.or]: [
                      { fName: { [Op.like]: `%${term}%` } },
                      { lName: { [Op.like]: `%${term}%` } },
                    ],
                  })),
                },
                // Allow for partial first/last name match
                { fName: { [Op.like]: `%${searchQuery}%` } },
                { lName: { [Op.like]: `%${searchQuery}%` } },
              ],
            }
          : undefined, // Skip filter if no search query
      },
    ],
  });
};

export default exports;
