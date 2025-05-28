import Education from "../sequelizeUtils/education.js";

const exports = {};

exports.findAllForUser = async (req, res) => {
  await Education.findAllForUser(req.params.userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving education for UserId:${req.params.userId}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await Education.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving education with id ${req.params.id}`,
      });
    });
};

exports.create = async (req, res) => {
  await Education.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error ocurred while trying to create a new education item",
      });
    });
};

exports.update = async (req, res) => {
  await Education.update(req.body, req.params.id)
    .then(() => {
      res.send({
        message: `Successfully updated Education with id of ${req.params.id}!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update education item with id of ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await Education.delete(req.params.id)
    .then(() => {
      res.send({ message: "Education deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to delete education item with id of ${req.params.id}`,
      });
    });
};

export default exports;
