import StudentReward from "../sequelizeUtils/studentReward.js";

const exports = {};

exports.findAll = async (req, res) => {
  await StudentReward
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

exports.findAllStudentRewardsForStudent = async (req, res) => {
  await StudentReward.findAllStudentRewardsForStudent(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

exports.findAllStudentRewardsForReward = async (req, res) => {
  await StudentReward.findAllStudentRewardsForReward(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

exports.findAllStudentRewardsForStudentAndReward = async (req, res) => {
  await StudentReward.findAllStudentRewardsForStudentAndReward(req.params.studentId, req.params.rewardId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

export default exports;
