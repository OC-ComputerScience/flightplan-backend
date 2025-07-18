import db from "../models/index.js";
const Student = db.student;
const Strength = db.strength;
const Experience = db.experience;
const Task = db.task;
const Event = db.event;

const exports = {};

exports.getStrengthsForStudent = async (req, res) => {
  const studentId = req.params.id;

 
  try {
    // Try fetching the student and include strengths in the response
    const student = await Student.findOne({
      where: { id: studentId }, // Find the student by ID
      include: {
        model: Strength, // Include the related Strength model
        through: { attributes: [] }, // Exclude join table attributes (only strengths)
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

  

    return res.status(200).json(student.strengths);
  } catch (err) {
    console.error("Error fetching strengths for student:", studentId, err); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching strengths", error: err.message });
  }
};

exports.getStrengthsForExperience = async (req, res) => {
  const experienceId = req.params.id;

  try {
    // Try fetching the experience and include strengths in the response
    const experience = await Experience.findOne({
      where: { id: experienceId }, // Find the experience by ID
      include: {
        model: Strength, // Include the related Strength model
        through: { attributes: [] }, // Exclude join table attributes (only strengths)
      },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }


    return res.status(200).json(experience.strengths);
  } catch (err) {
    console.error(
      "Error fetching strengths for experience:",
      experienceId,
      err,
    ); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching strengths", error: err.message });
  }
};

exports.getStrengthsForEvent = async (req, res) => {
  const eventId = req.params.id;

 
  try {
    // Try fetching the event and include strengths in the response
    const event = await Event.findOne({
      where: { id: eventId }, // Find the event by ID
      include: {
        model: Strength, // Include the related Strength model
        through: { attributes: [] }, // Exclude join table attributes (only strengths)
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

  

    return res.status(200).json(event.strengths);
  } catch (err) {
    console.error(
      "Error fetching strengths for event:",
      eventId,
      err,
    ); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching strengths", error: err.message });
  }
};

exports.getAllStrengths = async (req, res) => {
  try {
    const strengths = await Strength.findAll();
    return res.status(200).json(strengths);
  } catch (err) {
    console.error("Error fetching all strengths:", err);
    res
      .status(500)
      .json({ message: "Error fetching strengths", error: err.message });
  }
};

exports.getStrengthsForTask = async (req, res) => {
  
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      include: {
        model: Strength, // Include the related Strength model
        through: { attributes: [] }, // Exclude join table attributes (only strengths)
      },
    });

    if (!task) {
      return res.status(404).send({message: `Task with id = ${taskId} not found.`});
    }

    return res.status(200).json(task.strengths);

  } catch (err) {
    console.error("Error fetching strengths for task:", taskId, err); // Log the error
    res
      .status(500)
      .json({ message: "Error fetching strengths", error: err.message });
  }
};

export default exports;
