// link.controller.js
import Link from "../sequelizeUtils/link.js"; // Adjust the import according to your setup

const exports = {};
exports.findAllForStudent = async (req, res) => {
  await Link.findAllForStudent(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving links.",
      });
    });
};

exports.findAllForUser = async (req, res) => {
  await Link.findAllForUser(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving links.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Link.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving link.",
      });
    });
};

exports.create = async (req, res) => {
  await Link.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating link.",
      });
    });
};

exports.update = async (req, res) => {
  await Link.update(req.body, req.params.id)
    .then(() => {
      res.send({ message: "Link updated successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating link.",
      });
    });
};

exports.delete = async (req, res) => {
  await Link.delete(req.params.id)
    .then(() => {
      res.send({ message: "Link deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting link.",
      });
    });
};

export default exports;
