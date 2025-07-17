import db from "../models/index.js";
const Badge = db.badge;
const BadgeAwarded = db.badgeAwarded;
const BadExpTask = db.badExpTask;
const Task = db.task;
const Experience = db.experience;
import sequelize from "../sequelizeUtils/sequelizeInstance.js";
import { Op } from "sequelize";
import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.findAllBadges = async (page = 1, pageSize = 10, searchQuery = "") => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const whereCondition = searchQuery
    ? {
        // Assuming you want to search by title or description (modify as needed
        name: {
          [Op.like]: `%${searchQuery}%`, // Search in the title
        },
      }
    : {};

  let badges = await Badge.findAll({
    offset,
    limit,
    where: whereCondition, // Apply the search condition
  });

  badges = getFilesForBadges(badges);

  const count = await Badge.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { badges, count: totalPages };
};

exports.findAllBadgesForStudent = async (
  studentId,
  page = 1,
  pageSize = 10,
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const response = await Badge.findAndCountAll({
    include: {
      model: BadgeAwarded,
      as: "badgeAwarded",
      where: {
        studentId: studentId,
      },
      required: true,
    },
    offset,
    limit,
  });

  const badges = getFilesForBadges(response.rows);
  const totalPages = Math.ceil(response.count / pageSize);

  return { badges, total: response.count, count: totalPages };
};

exports.findAllActiveBadges = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const whereCondition = { status: "active" };
  let badges = await Badge.findAll({
    offset,
    limit,
    where: whereCondition,
  });

  badges = getFilesForBadges(badges);

  const count = await Badge.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { badges, count: totalPages };
};

exports.findAllInactiveBadges = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const whereCondition = { status: "inactive" };
  let badges = await Badge.findAll({
    offset,
    limit,
    where: whereCondition,
  });

  badges = getFilesForBadges(badges);

  const count = await Badge.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { badges, count: totalPages };
};

exports.findOne = async (badgeId) => {
  const response = await Badge.findOne({
    where: { id: badgeId },
    include: [
      {
        model: Task,
        as: "tasks",
      },
      {
        model: Experience,
        as: "experiences",
      },
    ],
  });
  return readFileForBadge(response);
};

exports.findByPk = async (badgeId) => {
  return Badge.findByPk(badgeId);
};

exports.getRuleTypes = () => {
  return Badge.getAttributes().ruleType.values;
};

exports.getStatusTypes = () => {
  return Badge.getAttributes().status.values;
};

exports.getUnviewedBadges = async (studentId) => {
  return Badge.findAll({
    include: {
      model: BadgeAwarded,
      as: "badgeAwarded",
      where: {
        studentId: studentId,
        viewed: false,
      },
      required: true,
    },
  });
};

exports.viewBadge = async (badgeId) => {
  return BadgeAwarded.update({ viewed: true }, { where: { badgeId: badgeId } });
};

exports.create = async (badgeData) => {
  const t = await sequelize.transaction();
  try {
    const badge = await Badge.create(badgeData, { transaction: t });
    if (badgeData.ruleType === "Task and Experience Defined") {
      /* eslint-disable no-undef */
      await Promise.all(
        badgeData.tasks.map(async (data) => {
          await BadExpTask.create(
            {
              badgeId: badge.id,
              taskId: data.task.id,
              quantity: data.quantity,
            },
            { transaction: t },
          );
        }),
      );
      /* eslint-disable no-undef */
      await Promise.all(
        badgeData.experiences.map(async (data) => {
          await BadExpTask.create(
            {
              badgeId: badge.id,
              experienceId: data.experience.id,
              quantity: data.quantity,
            },
            { transaction: t },
          );
        }),
      );
      await t.commit();
      return badge;
    }
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.update = async (badgeData, badgeId) => {
  await BadExpTask.destroy({ where: { badgeId: badgeId } });
  if (badgeData.ruleType === "Task and Experience Defined") {
    badgeData.tasks.forEach(async (data) => {
      await BadExpTask.create({
        badgeId: badgeId,
        taskId: data.task.id,
        quantity: data.quantity,
      });
    });
    badgeData.experiences.forEach(async (data) => {
      await BadExpTask.create({
        badgeId: badgeId,
        experienceId: data.experience.id,
        quantity: data.quantity,
      });
    });
  }

  return await Badge.update(badgeData, { where: { id: badgeId } });
};

exports.getUnviewedBadges = async (studentId) => {
  return await Badge.findAll({
    include: {
      model: BadgeAwarded,
      as: "badgeAwarded",
      where: {
        studentId: studentId,
        viewed: false,
      },
      required: true,
    },
  });
};

export default exports;

const getFilesForBadges = (badges) =>
  badges.map((badge) => {
    return readFileForBadge(badge);
  });

const readFileForBadge = (badge) => {
  try {
    if (badge.imageName) {
      badge.dataValues.image = FileHelpers.read(badge.imageName, "photos");
    }
    return badge;
  } catch (err) {
    console.log(err);
    badge.dataValues.image = null;
    badge.dataValues.imageName = null;
    return badge;
  }
};
