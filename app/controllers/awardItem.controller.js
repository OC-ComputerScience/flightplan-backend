import AwardItem from "../sequelizeUtils/awardItem.js";

const exports = {};

exports.create = async (req, res) => {
  await AwardItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the AwardItem.",
      });
    });
};

exports.findAllForSection = async (req, res) => {
  await AwardItem.findAllForSection(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving AwardItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await AwardItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving AwardItem.",
      });
    });
};

exports.update = async (req, res) => {
  await AwardItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the AwardItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await AwardItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the AwardItem.",
      });
    });
};

export default exports;
