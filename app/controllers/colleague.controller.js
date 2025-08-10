import Colleague from "../services/colleagueClientServices.js";
import Student from "../sequelizeUtils/student.js"

const exports = {};

exports.getStudentForEmail = async (req, res) => {
  await Colleague.getStudentForEmail(req.query.email)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching student for email:", err);
      res.status(500).json({
        message: "Error retrieving student for email",
        error: err.message,
      });
    });
};

exports.getStudentForOCStudentId = async (req, res) => {
  await Colleague.getStudentForOCStudentId(req.query.OCStudentId)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error fetching student for OC Student Id:", err);
      res.status(500).json({
        message: "Error retrieving student for OC Student Id",
        error: err.message,
      });
    });
};

exports.createNewStudentForUserId = async (req, res) => {
  await Colleague.createNewStudentForUserId(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error creating student for user id :", err);
      res.status(500).json({
        message: "Error retrieving student for user id",
        error: err.message,
      });
    });
};

exports.checkUpdateStudentWithColleagueDataForStudentId = async (req, res) => {
  const studentWithUserAndMajors = await Student.findByIdWithUserAndMajors(req.params.id);
  await Colleague.checkUpdateStudentWithColleagueData(studentWithUserAndMajors)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error("Error updating student with Colleague data:", err);
      res.status(500).json({
        message: "Error updating student with Colleague data",
        error: err.message,
      });
    });
};

export default exports;