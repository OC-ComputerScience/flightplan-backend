import Student from "../sequelizeUtils/student.js";

const exports = {};

exports.findStudentForUserId = async (req, res) => {
  await Student.findStudentForUserId(req.params.userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving strengths.",
      });
    });
};

exports.create = async (req, res) => {
  // Validate required fields in the request body
  if (
    req.body.graduationDate == null ||
    req.body.semestersFromGrad == null ||
    req.body.userId == null
  ) {
    return res.status(400).send({
      message:
        "Graduation date, Semesters from grad, and userId cannot be empty!",
    });
  }

  const studentData = {
    graduationDate: req.body.graduationDate,
    semestersFromGrad: req.body.semestersFromGrad,
    userId: req.body.userId,
    pointsAwarded: req.body.pointsAwarded || 0,
    pointsUsed: req.body.pointsUsed || 0,
  };

  await Student.create(studentData)
    .then((data) => res.status(201).send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the student.",
      }),
    );
};

// Retrieve all Students
exports.findAll = async (req, res) => {
  await Student.findAll(req.query)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students.",
      }),
    );
};

// Retrieve a single Student with id
exports.findOne = async (req, res) => {
  await Student.findById(req.params.id)
    .then((data) => {
      if (data) res.send(data);
      else
        res
          .status(404)
          .send({ message: `Student with id=${req.params.id} not found.` });
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error retrieving Student with id=${req.params.id}` }),
    );
};

// Update a Student with id
exports.update = async (req, res) => {
  await Student.update(req.params.id, req.body)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Student updated successfully." });
      } else {
        res.send({
          message: `Student with id=${req.params.id} not found or no updates provided.`,
        });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error updating Student with id=${req.params.id}` }),
    );
};

// Delete a Student with id
exports.delete = async (req, res) => {
  await Student.delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Student deleted successfully!" });
      } else {
        res.send({ message: `Student with id=${req.params.id} not found.` });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error deleting Student with id=${req.params.id}` }),
    );
};

exports.findStudentForFlightPlanId = async (req, res) => {
  await Student.findStudentForFlightPlanId(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving student for flight plan id.",
      });
    });
};

exports.checkStudentSemesterFromGraduation = async (req, res) => {
  await Student.checkStudentSemesterFromGraduation(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Student semester from graduation updated successfully." });
      } else {
        res.send({
          message: `Student with id=${req.params.id} not found or no updates provided.`,
        });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error updating Student with id=${req.params.id}` }),
    );
};

exports.updatePoints = async (req, res) => {
  await Student.updatePoints(req.params.id, req.body.points)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating points.",
      });
    });
};

exports.getPoints = async (req, res) => {
  await Student.getPoints(req.params.id)
    .then((data) => {
      console.log("data", data);
      res.send({ points: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving points.",
      });
    });
};

exports.getStudent = async (req, res) => {
  await Student.getStudent(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving student.",
      });
    });
};

exports.addMajor = async (req, res) => {
  await Student.addMajor(req.params.id, req.body.majorId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while adding major to student.",
      });
    });
};

exports.removeMajor = async (req, res) => {
  await Student.removeMajor(req.params.id, req.body.majorId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing major from student.",
      });
    });
};

exports.addStrength = async (req, res) => {
  await Student.addStrength(req.params.id, req.body.strengthId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while adding strength to student.",
      });
    });
};

exports.removeStrength = async (req, res) => {
  await Student.removeStrength(req.params.id, req.body.strengthId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing strength from student.",
      });
    });
};

export default exports;
