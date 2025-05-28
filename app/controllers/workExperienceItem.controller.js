import WorkExperienceItem from "../sequelizeUtils/workExperienceItem.js";

const exports = {};

exports.create = async (req, res) => {
  await WorkExperienceItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the ExperienceItem.",
      });
    });
};

exports.findAllForSection = async (req, res) => {
  await WorkExperienceItem.findAllForSection(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving ExperienceItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await WorkExperienceItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ExperienceItem.",
      });
    });
};

exports.update = async (req, res) => {
  await WorkExperienceItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while updating the ExperienceItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await WorkExperienceItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while deleting the ExperienceItem.",
      });
    });
};

export default exports;
