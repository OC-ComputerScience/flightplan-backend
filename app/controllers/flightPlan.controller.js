import FlightPlan from "../sequelizeUtils/flightPlan.js";

const exports = {};

exports.create = async (req, res) => {
  await FlightPlan.createFlightPlan(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the flightPlan.",
      });
    });
};

exports.generate = async (req, res) => {
  await FlightPlan.generateFlightPlan(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while generating a flight plan for student with id: ${req.params.id}`,
      });
    });
};

exports.findOne = async (req, res) => {
  await FlightPlan.findOneFlightPlan(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find flightPlan with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving flightPlan with id = " + req.params.id,
      });
      console.log("Could not find flightPlan: " + err);
    });
};

exports.findAll = async (req, res) => {
  await FlightPlan.findAllFlightPlans(req.query.page, req.query.pageSize)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving flightPlans.",
      });
    });
};

exports.findFlightPlanForStudent = async (req, res) => {
  await FlightPlan.findFlightPlanForStudent(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving flightPlans.",
      });
    });
};

exports.findProgressForFlightPlan = async (req, res) => {
  await FlightPlan.findProgressForFlightPlan(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving flightPlans.",
      });
    });
};

exports.update = async (req, res) => {
  await FlightPlan.updateFlightPlan(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FlightPlan was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update flightPlan with id = ${req.params.id}. Maybe flightPlan was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating flightPlan with id = " + req.params.id,
      });
      console.log("Could not update flightPlan: " + err);
    });
};

exports.delete = async (req, res) => {
  await FlightPlan.deleteFlightPlan(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FlightPlan was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete flightPlan with id = ${req.params.id}. Maybe flightPlan was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete flightPlan with id = " + req.params.id,
      });
      console.log("Could not delete flightPlan: " + err);
    });
};

export default exports;
