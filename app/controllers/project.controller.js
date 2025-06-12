import Project from "../sequelizeUtils/project.js";

const exports = {};

exports.findAllForUser = async (req, res) => {
  await Project.findAllForUser(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Project.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving project.",
      });
    });
};

exports.create = async (req, res) => {
  await Project.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating project.",
      });
    });
};

exports.update = async (req, res) => {
  await Project.update(req.body, req.params.id)
    .then(() => {
      res.send({ message: "Project updated successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating project.",
      });
    });
};

exports.delete = async (req, res) => {
  await Project.delete(req.params.id)
    .then(() => {
      res.send({ message: "Project deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting project.",
      });
    });
};

export default exports;
