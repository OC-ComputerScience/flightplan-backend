import Comment from "../sequelizeUtils/comment.js";

const exports = {};

exports.findAllForReview = async (req, res) => {
  await Comment.findAllForReview(req.params.reviewId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occured while trying to get all comments for review with id ${req.params.reviewId}`,
      });
    });
};

exports.create = async (req, res) => {
  await Comment.create(req.body)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Something went wrong while trying to create a comment!",
      });
    });
};

exports.update = async (req, res) => {
  await Comment.update(req.body, req.params.id)
    .then((data) => {
      res.send({
        message: `Successfully updated Comment with id of ${req.params.id}!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Something went wrong while trying to update comment with id ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await Comment.delete(req.params.id)
    .then(() => {
      res.send({ message: "Comment deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to delete comment with id of ${req.params.id}`,
      });
    });
};

export default exports;
