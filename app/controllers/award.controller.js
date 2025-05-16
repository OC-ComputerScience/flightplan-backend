import Award from "../sequelizeUtils/award.js";

const exports = {};

// Create and Save a new User
exports.create = async (req, res) => {
  await Award.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Award.",
      });
    });
};

// Retrieve all awards for a person from the database.
exports.findAllForUser = async (req, res) => {
  await Award.findAllForUser(req.params.userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving awards.",
      });
    });
};

// Find a single Award with an id
exports.findOne = async (req, res) => {
  await Award.findOne(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Award with id=${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Award with id=" + req.params.id,
      });
    });
};

// Update an Award by the id in the request
exports.update = async (req, res) => {
  await Award.update(req.body, req.params.id)
    .then((num) => {
      res.send({
        message: "Award was updated successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Award with id=" + req.params.id,
      });
    });
};

// Delete an Award with the specified id in the request
exports.delete = async (req, res) => {
  await Award.delete(req.params.id)
    .then((num) => {
      res.send({
        message: "Award was deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Award with id=" + req.params.id,
      });
    });
};

export default exports;
