import Submission from "../sequelizeUtils/submission.js";

const exports = {};

exports.create = async (req, res) => {
  await Submission.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the submission.",
      });
    });
};

exports.bulkCreate = async (req, res) => {
  Submission.bulkCreate(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the submissions.",
      });
    });
};

exports.findAllForFlightPlanItem = async (req, res) => {
  Submission.findAllForFlightPlanItem(req.params.flightPlanItemId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while getting submissions for this flightPlanItem",
      });
    });
};

exports.discardSubmissionForFlightPlanItem = async (req, res) => {
  Submission.discardSubmissionForFlightPlanItem(req.params.flightPlanItemId)
    .then((data) => {
      res.status(200).send({ message: "Submissions successfully deleted" });
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while discarding submissions for this flightPlanItem",
      });
    });
};

export default exports;
