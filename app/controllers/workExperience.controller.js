import WorkExperience from "../sequelizeUtils/workExperience.js";

const exports = {};

exports.findAllForUser = async (req, res) => {
  await WorkExperience.findAllForUser(req.params.userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving experience for UserId:${userId}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await WorkExperience.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving experience with id ${req.params.id}`,
      });
    });
};

exports.create = async (req, res) => {
  await WorkExperience.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error ocurred while trying to create a new work experience item",
      });
    });
};

exports.update = async (req, res) => {
  await WorkExperience.update(req.body, req.params.id)
    .then(() => {
      res.send({
        message: `Successfully updated Experience with id of ${req.params.id}!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update experience item with id of ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await WorkExperience.delete(req.params.id)
    .then(() => {
      res.send({ message: "Experience deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to delete experience item with id of ${req.params.id}`,
      });
    });
};

export default exports;
