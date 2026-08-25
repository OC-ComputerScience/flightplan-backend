import db from "../models/index.js";
const StudentReward = db.studentReward;
const Reward = db.reward;
const User = db.user;

const exports = {};

exports.findAll = async () => {
  return await StudentReward.findAll();
};

exports.findAllStudentRewardsForStudent = async (studentId) => {
  return await StudentReward.findAll({
    where: {
      studentId: studentId,
    },
    include: [
      {
        model: Reward,
        as: "reward",
        attributes: ["id", "name", "points", "redemptionType"],
      },
      {
        model: User,
        as: "fulfilledBy",
        attributes: ["id", "fullName", "fName", "lName"],
      },
    ],
    order: [["date", "DESC"]],
  });
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
