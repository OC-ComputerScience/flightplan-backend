import majorUtils from "../sequelizeUtils/major.js";

const exports = {};

exports.create = async (req, res) => {
  await majorUtils
    .create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the major.",
      });
    });
};

exports.findOne = async (req, res) => {
  await majorUtils
    .findOne(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find major with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving major with id = " + req.params.id,
      });
      console.log("Could not find major: " + err);
    });
};

exports.findAll = async (req, res) => {
  await majorUtils
    .findAll(req.query)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving majors.",
      });
    });
};

exports.update = async (req, res) => {
  await majorUtils
    .update(req.params.id, req.body)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Major was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update major with id = ${req.params.id}. Maybe major was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating major with id = " + req.params.id,
      });
      console.log("Could not update major: " + err);
    });
};

exports.delete = async (req, res) => {
  await majorUtils
    .delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Major was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete major with id = ${req.params.id}. Maybe major was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Could not delete major with id = " + req.params.id,
      });
      console.log("Could not delete major: " + err);
    });
};

export default exports;
