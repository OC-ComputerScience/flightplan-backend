import Resume from "../sequelizeUtils/resume.js";

const exports = {};

exports.create = async (req, res) => {
  await Resume.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error ocurred while trying to create a new resume",
      });
    });
};

exports.update = async (req, res) => {
  await Resume.update(req.body, req.params.id)
    .then((data) => {
      if (data[0] > 0) {
        res.send({
          message: `Successfully updated Resume with id of ${req.params.id}!`,
        });
      } else {
        res.send({
          message: `Resume with id of ${req.params.id} doesn't exist!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update resume with id of ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await Resume.delete(req.params.id)
    .then((data) => {
      if (data == 1) {
        res.send({ message: "Resume deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Resume with id=${req.params.id}. Maybe Resume was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to delete resume with id of ${req.params.id}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await Resume.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `An error occurred retrieving the resume.`,
      });
    });
};

exports.findAllForUser = async (req, res) => {
  await Resume.findAllForUser(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve resumes for user with id ${req.params.id}`,
      });
    });
};

exports.findAllForReview = async (req, res) => {
  await Resume.findAllForReview(req.query.search)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve resumes for review.`,
      });
    });
};

export default exports;
