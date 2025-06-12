import Review from "../sequelizeUtils/review.js";

const exports = {};

exports.findAllForResume = async (req, res) => {
  await Review.findAllForResume(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve reviews for resume with id ${req.params.id}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await Review.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve review with id ${req.params.id}`,
      });
    });
};

exports.create = async (req, res) => {
  await Review.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || `An error occurred while trying to create review`,
      });
    });
};

exports.update = async (req, res) => {
  await Review.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to update review with id ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await Review.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to delete review with id ${req.params.id}`,
      });
    });
};
