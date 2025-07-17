import Experience from "../sequelizeUtils/experience.js";

const exports = {};

exports.create = async (req, res) => {
  await Experience.createExperience(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the experience.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Experience.findOneExperience(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find experience with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving experience with id = " + req.params.id,
      });
      console.log("Could not find experience: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Experience.findAllExperiences(
    req.query.page,
    req.query.pageSize,
    req.query.searchQuery,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks.",
      });
    });
};

exports.findAllOptionalForStudentId = async (req, res) => {
  await Experience.findAllOptionalForStudentId(
    req.params.studentId,
    req.query.searchQuery,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving experiences.",
      });
    });
};

exports.findAllActiveExperiences = async (req, res) => {
  await Experience.findAllActiveExperiences()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving experiences.",
      });
    });
};

exports.findAllInactiveExperiences = async (req, res) => {
  await Experience.findAllInactiveExperiences()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving experiences.",
      });
    });
};

exports.update = async (req, res) => {
  await Experience.updateExperience(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Experience was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update experience with id = ${req.params.id}. Maybe experience was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating experience with id = " + req.params.id,
      });
      console.log("Could not update experience: " + err);
    });
};

exports.getCategories = (req, res) => {
  res.send(Experience.getCategories());
};

exports.getSchedulingTypes = (req, res) => {
  res.send(Experience.getSchedulingTypes());
};

exports.getSubmissionTypes = (req, res) => {
  res.send(Experience.getSubmissionTypes());
};

exports.getStatusTypes = (req, res) => {
  res.send(Experience.getStatusTypes());
};

exports.addStrength = async (req, res) => {
  await Experience.addStrength(req.params.id, req.body.strengthId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while adding strength to experience.",
      });
    });
};

exports.removeStrength = async (req, res) => {
  await Experience.removeStrength(req.params.id, req.body.strengthId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing strength from experience.",
      });
    });
};

exports.addMajor = async (req, res) => {
  await Experience.addMajor(req.params.id, req.body.majorId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while adding major to experience.",
      });
    });
};

exports.removeMajor = async (req, res) => {
  await Experience.removeMajor(req.params.id, req.body.majorId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing major from experience.",
      });
    });
};

export default exports;
