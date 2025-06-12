import ResumeSection from "../sequelizeUtils/resumeSection.js";

const exports = {};

exports.findAllForResume = async (req, res) => {
  await ResumeSection.findAllForResume(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve resume sections for resume with id ${req.params.id}`,
      });
    });
};

exports.findAllForResumeWithComments = async (req, res) => {
  await ResumeSection.findAllForResumeWithComments(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve resume sections for resume with id ${req.params.id}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await ResumeSection.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to retrieve resume section with id ${req.params.id}`,
      });
    });
};

exports.create = async (req, res) => {
  await ResumeSection.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to create resume section`,
      });
    });
};

exports.update = async (req, res) => {
  await ResumeSection.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to update resume section with id ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await ResumeSection.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error occurred while trying to delete resume section with id ${req.params.id}`,
      });
    });
};

export default exports;
