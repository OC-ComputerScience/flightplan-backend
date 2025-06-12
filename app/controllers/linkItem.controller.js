import LinkItem from "../sequelizeUtils/linkItem.js";

const exports = {};

exports.create = async (req, res) => {
  await LinkItem.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the LinkItem.",
      });
    });
};

exports.findAllForSection = async (req, res) => {
  await LinkItem.findAllForSection(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving LinkItems.",
      });
    });
};

exports.findOne = async (req, res) => {
  await LinkItem.findOne(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving LinkItem.",
      });
    });
};

exports.update = async (req, res) => {
  await LinkItem.update(req.body, req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the LinkItem.",
      });
    });
};

exports.delete = async (req, res) => {
  await LinkItem.delete(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting the LinkItem.",
      });
    });
};

export default exports;
