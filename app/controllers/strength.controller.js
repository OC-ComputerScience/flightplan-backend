import db from "../models/index.js";
const Student = db.student;
const Strength = db.strength;
const Experience = db.experience;

const exports = {};

exports.getStrengthsForStudent = async (req, res) => {
  const studentId = req.params.id;

  console.log("Received request for student ID:", studentId); // Log the incoming request

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

    console.log(student.strengths);

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

  console.log("Received request for experience ID:", experienceId); // Log the incoming request

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

    console.log(experience.strengths);

    return res.status(200).json(experience.strengths);
  } catch (err) {
    console.error("Error fetching strengths for experience:", experienceId, err); // Log the error
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

export default exports;
