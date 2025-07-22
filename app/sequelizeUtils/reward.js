import db from "../models/index.js";
const Reward = db.reward;
const Student = db.student;
const StudentReward = db.studentReward;
const Notification = db.notification;
const User = db.user;
import SequelizeInstance from "./sequelizeInstance.js";
import { Op } from "sequelize";
import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.findAllRewards = async (
  page = null,
  pageSize = null,
  searchQuery = "",
  filters = {},
) => {
  const whereCondition = {};

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.redemptionType) {
    whereCondition.redemptionType = {
      [Op.like]: `%${filters.redemptionType}%`,
    };
  }

  let order = [];

  if (filters.sortAttribute && filters.sortDirection) {
    // Default to ascending order if direction is not provided
    const direction =
      filters.sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    order = [[filters.sortAttribute, direction]];
  }

  const queryOptions = {
    where: whereCondition,
    order,
  };

  // Only add pagination if both page and pageSize are provided
  if (page !== null && pageSize !== null) {
    const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    const limit = parseInt(pageSize, 10);
    queryOptions.offset = offset;
    queryOptions.limit = limit;
  }

  let rewards = await Reward.findAll(queryOptions);
  rewards = getFilesForRewards(rewards);

  // Only count total pages if pagination is being used
  if (page !== null && pageSize !== null) {
    const count = await Reward.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(count / parseInt(pageSize, 10));
    return { rewards, count: totalPages };
  }

  return { rewards };
};

exports.findAllRewardsForStudent = async (studentId) => {
  const response = await Reward.findAll({
    include: {
      model: Student,
      where: {
        id: studentId,
      },
      required: true,
    },
  });
  return getFilesForRewards(response);
};

exports.findAllActiveRewardsForStudent = async (studentId) => {
  const response = await Reward.findAll({
    where: {
      status: "active",
    },
    include: {
      model: Student,
      where: {
        id: studentId,
      },
      required: true,
    },
  });
  return getFilesForRewards(response);
};

exports.findAllActiveRewards = async () => {
  const response = await Reward.findAll({
    where: {
      status: "active",
    },
  });
  return getFilesForRewards(response);
};

exports.findAllInactiveRewards = async () => {
  const response = await Reward.findAll({
    where: {
      status: "inactive",
    },
  });
  return getFilesForRewards(response);
};

exports.findOneReward = async (rewardId) => {
  const response = await Reward.findByPk(rewardId);
  return readFileForReward(response);
};

exports.findByPk = async (rewardId) => {
  return Reward.findByPk(rewardId);
};

exports.createReward = async (rewardData) => {
  return await Reward.create(rewardData);
};

exports.updateReward = async (rewardData, rewardId) => {
  return await Reward.update(rewardData, { where: { id: rewardId } });
};

exports.redeemReward = async (rewardId, studentId, userId) => {
  const t = await SequelizeInstance.transaction();
  try {
    const reward = await Reward.findByPk(rewardId, { transaction: t });
    const student = await Student.findByPk(studentId, {
      transaction: t,
      include: {
        model: User,
        as: "user",
        attributes: ["id"],
      },
    });

    if (reward.quantityAvaliable !== null && reward.quantityAvaliable > 0) {
      await Reward.update(
        { quantityAvaliable: reward.quantityAvaliable - 1 },
        { where: { id: rewardId }, transaction: t }
      );
    }

    await Student.update(
      {
        pointsUsed: student.pointsUsed + reward.points,
      },
      { where: { id: studentId }, transaction: t },
    );

    await StudentReward.create(
      {
        rewardId,
        studentId,
        date: new Date(),
        pointsDeducted: reward.points,
        fulfillingUser: userId,
      },
      { transaction: t },
    );

    await Notification.create(
      {
        header: `Reward Redeemed`,
        description: `You have redeemed ${reward.name} for ${reward.points} points`,
        read: false,
        userId: student.user.id,
      },
      { transaction: t },
    );

    await t.commit();
    return { message: "Reward redeemed successfully" };
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};

exports.getStatusTypes = () => {
  return Reward.getAttributes().status.values;
};

const getFilesForRewards = (rewards) =>
  rewards.map((reward) => {
    return readFileForReward(reward);
  });

const readFileForReward = (reward) => {
  try {
    if (reward.imageName) {
      reward.dataValues.image = FileHelpers.read(reward.imageName);
    }
    return reward;
  } catch (err) {
    console.log(err);
    reward.dataValues.image = null;
    reward.dataValues.imageName = null;
    return reward;
  }
};

export default exports;
