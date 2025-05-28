import db from "../models/index.js";
const Review = db.review;
const Comment = db.comment;
const ResumeSection = db.resumeSection;

const exports = {};

exports.findAllForResume = async (resumeId) => {
  return await Review.findAll({
    where: { resumeId },
    include: [{ model: Comment, include: [{ model: ResumeSection }] }],
  });
};

exports.findOne = async (id) => {
  return await Review.findByPk(id);
};

exports.create = async (reviewData) => {
  return await Review.create(reviewData);
};

exports.update = async (reviewData, id) => {
  return await Review.update(reviewData, { where: { id } });
};

exports.delete = async (id) => {
  return await Review.destroy({ where: { id } });
};

export default exports;
