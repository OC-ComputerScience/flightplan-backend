import db from "../models/index.js";
const StudentReward = db.studentReward;

const exports = {};

exports.findAll = async () => {
  return await StudentReward.findAll();
};

exports.findAllStudentRewardsForStudent = async (studentId) => {
  return await StudentReward.findAll({
      where: {
        studentId: studentId,
      },
    },
  );
};

exports.findAllStudentRewardsForReward = async (rewardId) => {
  return await StudentReward.findAll({
      where: {
        rewardId: rewardId,
      },
    },
  );
};

exports.findAllStudentRewardsForStudentAndReward = async (studentId, rewardId) => {
  return await StudentReward.findAll({
      where: {
        studentId: studentId,
        rewardId: rewardId,
      },
    },
  );
};

export default exports;
