import Statistics from "../sequelizeUtils/statistics.js";

const exports = {};

exports.getStudentSemesterCount = async (req, res) => {
  try {
    const studentCount = await Statistics.getStudentSemesterCount();
    res.send({ studentCount });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving student semester count."
    });
  }
};

exports.getStudentCountsForCompletedItems = async (req, res) => {
  try {
    const studentCounts = await Statistics.getStudentCountsForCompletedItems();
    res.send({ studentCounts });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving student semester count."
    });
  }
};

export default exports;
