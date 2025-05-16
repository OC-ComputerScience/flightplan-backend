import db from "../models/index.js";
const Comment = db.comment;

const exports = {};

exports.findAllForReview = async (reviewId) => {
  return await Comment.findAll({ where: { reviewId: reviewId } });
};

exports.create = async (commentData) => {
  return await Comment.create(commentData);
};

exports.update = async (commentData, id) => {
  return await Comment.update(commentData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await Comment.destroy({ where: { id: id } });
};

export default exports;
