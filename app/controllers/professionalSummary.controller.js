import ProfessionalSummary from "../sequelizeUtils/professionalSummary.js";

const exports = {};

exports.findAllForUser = async (req, res) => {
  await ProfessionalSummary.findAllForUser(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving Professional Summary for UserId:${req.params.id}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await ProfessionalSummary.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving Professional Summary with id:${id}`,
      });
    });
};

exports.findAllForResume = async (req, res) => {
  await ProfessionalSummary.findForResume(req.params.resumeId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({});
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving Professional Summary for resumeId:${req.params.resumeId}`,
      });
    });
};

exports.create = async (req, res) => {
  await ProfessionalSummary.create(req.body)

    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error ocurred while trying to create a new professional summary",
      });
    });
};

exports.update = async (req, res) => {
  await ProfessionalSummary.update(req.body, req.params.id)
    .then(() => {
      res.send({
        message: `Successfully updated Professional Summary with id of ${req.params.id}!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update professional summary item with id of ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await ProfessionalSummary.delete(req.params.id)
    .then((data) => {
      if (data == 1) {
        res.send({ message: "Professional Summary deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Professional Summary with id=${req.params.id}. Maybe Professional Summary was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update professional summary item with id of ${req.params.id}`,
      });
    });
};

export default exports;
