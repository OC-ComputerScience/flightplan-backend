import Skill from "../sequelizeUtils/skill.js";

const exports = {};

exports.findAllForUser = async (req, res) => {
  await Skill.findAllForUser(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving skill for UserId:${req.params.id}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await Skill.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error ocurred while retrieving skill with id ${req.params.id}`,
      });
    });
};

exports.create = async (req, res) => {
  await Skill.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error ocurred while trying to create a new skill item",
      });
    });
};

exports.update = async (req, res) => {
  await Skill.update(req.body, req.params.id)
    .then((data) => {
      if (data[0] > 0) {
        res.send({
          message: `Successfully updated Skill with id of ${req.params.id}!`,
        });
      } else {
        res.send({
          message: `Skill with id of ${req.params.id} doesn't exist!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update skill item with id of ${req.params.id}`,
      });
    });
};

exports.delete = async (req, res) => {
  await Skill.delete(req.params.id)
    .then((data) => {
      if (data == 1) {
        res.send({ message: "Skill deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Skill with id=${req.params.id}. Maybe Skill was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `An error ocurred while trying to update skill item with id of ${req.params.id}`,
      });
    });
};

export default exports;
