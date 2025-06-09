import db from "../models/index.js";
import majorUtils from "../sequelizeUtils/major.js";
import db from "../models/index.js";
const Major = db.major;
const Experience = db.experience;

const exports = {};
const Major = db.major;
const Task = db.task;

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

exports.getMajorsForTask = async (req, res) => {
  
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      include: {
        model: Major, // Include the related Major model
        through: { attributes: [] }, // Exclude join table attributes (only strengths)
      },
    });

    if (!task) {
      return res.status(404).send({message: `Task with id = ${taskId} not found.`});
    }
    
    return res.status(200).json(task.majors);
  
  } catch (err) {
    console.error("Error fetching majors for task:", taskId, err); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching majors", error: err.message });
  }
};

exports.getAllMajors = async (req, res) => {
  try {
    const majors = await Major.findAll();
    return res.status(200).json(majors);
  } catch (err) {
    console.error("Error fetching all majors:", err);
    res
      .status(500)
      .json({ message: "Error fetching majors", error: err.message });
  }
};

exports.getMajorsForExperience = async (req, res) => {
  const experienceId = req.params.id;

  console.log("Received request for experience ID:", experienceId); // Log the incoming request

  try {
    // Try fetching the experience and include majors in the response
    const experience = await Experience.findOne({
      where: { id: experienceId }, // Find the experience by ID
      include: {
        model: Major, // Include the related Major model
        through: { attributes: [] }, // Exclude join table attributes (only majors)
      },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    console.log(experience.majors);

    return res.status(200).json(experience.majors);
  } catch (err) {
    console.error("Error fetching majors for experience:", experienceId, err); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching majors", error: err.message });
  }
};

export default exports;
