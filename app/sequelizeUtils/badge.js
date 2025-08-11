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


// Returns a paginated list of all badges, optionally filtered by a search query.
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

// Returns a paginated list of all badges that have been awarded to a specific student, regardless of badge status.
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

// Returns a paginated list of all badges that are available for a specific student, including those already awarded.
exports.findAllDisplayableBadgesForStudent = async (
  studentId,
  page = 1,
  pageSize = 10,
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // 1. Get all awarded badges (any status)
  const awarded = await BadgeAwarded.findAll({
    where: { studentId },
    attributes: ["badgeId"],
  });
  const awardedIds = awarded.map((a) => a.badgeId);

  const awardedBadges = await Badge.findAll({
    where: { id: { [Op.in]: awardedIds.length ? awardedIds : [0] } },
  });

  // 2. Get all active badges not yet awarded
  const unawardedActiveBadges = await Badge.findAll({
    where: {
      status: "active",
      id: { [Op.notIn]: awardedIds.length ? awardedIds : [0] },
    },
    offset,
    limit,
  });

  // 3. Combine and return
  const badges = getFilesForBadges([...awardedBadges, ...unawardedActiveBadges]);
  // Optionally, implement pagination after combining if needed

  return { badges, total: badges.length };
};


// Returns a paginated list of all badges that are available (the status is active) for a student to earn, excluding those already awarded.
exports.findAllAvailableBadgesForStudent = async (
  studentId,
  page = 1,
  pageSize = 10,
) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Find all badge IDs already awarded to the student
  const awarded = await BadgeAwarded.findAll({
    where: { studentId },
    attributes: ["badgeId"],
  });
  const awardedIds = awarded.map((a) => a.badgeId);

  // Find all active badges NOT in awardedIds
  const { rows, count } = await Badge.findAndCountAll({
    where: {
      status: "active",
      id: { [Op.notIn]: awardedIds.length ? awardedIds : [0] },
    },
    offset,
    limit,
  });

  const badges = getFilesForBadges(rows);
  const totalPages = Math.ceil(count / pageSize);

  return { badges, total: count, count: totalPages };
};

// Returns a paginated list of all badges with status "active".
exports.findAllActiveBadges = async (page = 1, pageSize = 6) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 6);
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

// Returns a paginated list of all badges with status "inactive".
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

// Retrieves a single badge by its ID, including its associated tasks and experiences.
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

// Retrieves a badge by its primary key (ID).
exports.findByPk = async (badgeId) => {
  return Badge.findByPk(badgeId);
};

// Returns the possible rule types defined in the Badge model's ENUM.
exports.getRuleTypes = () => {
  return Badge.getAttributes().ruleType.values;
};

// Returns the possible status types defined in the Badge model's ENUM.
exports.getStatusTypes = () => {
  return Badge.getAttributes().status.values;
};

// Returns all badges awarded to a student that have not yet been viewed by them.
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

// Marks a badge as viewed for all BadgeAwarded records with the given badge ID.
exports.viewBadge = async (badgeId) => {
  return BadgeAwarded.update({ viewed: true }, { where: { badgeId: badgeId } });
};

// Creates a new badge (and associated BadExpTask records if rule type is "Task and Experience Defined") within a transaction.
exports.create = async (badgeData) => {
  const t = await sequelize.transaction();
  try {
    const badge = await Badge.create(badgeData, { transaction: t });
    if (badgeData.ruleType === "Experiences and Tasks") {
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
    else {
      await t.commit();
      return badge;
    }
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// Updates a badge and its associated BadExpTask records, replacing them as needed.
exports.update = async (badgeData, badgeId) => {
  await BadExpTask.destroy({ where: { badgeId: badgeId } });
  if (badgeData.ruleType === "Experiences and Tasks") {
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

// Maps over a list of badges and attaches image data to each.
const getFilesForBadges = (badges) =>
  badges.map((badge) => {
    return readFileForBadge(badge);
  });

// Reads and attaches the image file for a badge, or sets image fields to null if not found.
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

export default exports;