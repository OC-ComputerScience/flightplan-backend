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

export default exports;
