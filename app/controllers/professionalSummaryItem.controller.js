import ProfessionalSummaryItem from "../sequelizeUtils/professionalSummaryItem.js";

const exports = {};

exports.create = async (req, res) => {
  await ProfessionalSummaryItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the ProfessionalSummaryItem.",
      });
    });
};

exports.findAll = async (req, res) => {
  await ProfessionalSummaryItem.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving ProfessionalSummaryItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await ProfessionalSummaryItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving ProfessionalSummaryItem.",
      });
    });
};

exports.update = async (req, res) => {
  await ProfessionalSummaryItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while updating the ProfessionalSummaryItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await ProfessionalSummaryItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while deleting the ProfessionalSummaryItem.",
      });
    });
};

export default exports;
