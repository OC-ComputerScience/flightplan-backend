import EducationItem from "../sequelizeUtils/educationItem.js";

const exports = {};

exports.create = async (req, res) => {
  await EducationItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the EducationItem.",
      });
    });
};

exports.findAllForSection = async (req, res) => {
  await EducationItem.findAllForSection(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving EducationItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await EducationItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving EducationItem.",
      });
    });
};

exports.update = async (req, res) => {
  await EducationItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while updating the EducationItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await EducationItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while deleting the EducationItem.",
      });
    });
};

export default exports;
