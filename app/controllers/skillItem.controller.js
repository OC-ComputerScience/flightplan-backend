import SkillItem from "../sequelizeUtils/skillItem.js";

const exports = {};

exports.create = async (req, res) => {
  await SkillItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the SkillItem.",
      });
    });
};

exports.findAllForSection = async (req, res) => {
  await SkillItem.findAllForSection(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving SkillItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await SkillItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving SkillItem.",
      });
    });
};

exports.update = async (req, res) => {
  await SkillItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the SkillItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await SkillItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the SkillItem.",
      });
    });
};

export default exports;
