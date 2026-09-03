import Semester from "../sequelizeUtils/semester.js";

const exports = {};

exports.findAll = async (req, res) => {
  await Semester.findAllSemesters()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving semesters.",
      });
    });
};

exports.findAllUnfiltered = async (req, res) => {
  await Semester.findAllSemestersUnfiltered()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving semesters.",
      });
    });
};

exports.findAllForAdmin = async (req, res) => {
  await Semester.findAllForAdmin(req.query)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving semesters.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Semester.findOne(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find semester with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving semester with id = " + req.params.id,
      });
      console.error("Could not find semester: " + err);
    });
};

exports.create = async (req, res) => {
  await Semester.create(req.body)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the semester.",
      });
    });
};

exports.update = async (req, res) => {
  await Semester.update(req.params.id, req.body)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Semester was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update semester with id = ${req.params.id}. Maybe semester was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error updating semester with id = " + req.params.id,
      });
    });
};

exports.delete = async (req, res) => {
  await Semester.delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Semester was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete semester with id = ${req.params.id}. Maybe semester was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Could not delete semester with id = " + req.params.id,
      });
    });
};

export default exports;
