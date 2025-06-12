import ProjectItem from "../sequelizeUtils/projectItem.js";

const exports = {};

exports.create = async (req, res) => {
  await ProjectItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ProjectItem.",
      });
    });
};

exports.findAllForSection = async (req, res) => {
  await ProjectItem.findAllForSection(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProjectItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await ProjectItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProjectItem.",
      });
    });
};

exports.update = async (req, res) => {
  await ProjectItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the ProjectItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await ProjectItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the ProjectItem.",
      });
    });
};

export default exports;
