import db from "../models/index.js";
const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;
const Task = db.task;
const Experience = db.experience;
const User = db.user;
const Badge = db.badge;
const BadExpTask = db.badExpTask;
const BadgeAwarded = db.badgeAwarded;
const Notification = db.notification;
const Student = db.student;
import { Op } from "sequelize";
const kickOffBadgeAwarding = async (flightPlanItemId) => {
  try {
    // Fetch initial data

    const flightPlanItem = await FlightPlanItem.findOne({
      where: { id: flightPlanItemId },
    });
    const student = await Student.findOne({
      include: {
        model: FlightPlan,
        where: { id: flightPlanItem.flightPlanId },
        required: true,
      },
    });
    const user = await User.findByPk(student.userId);
    const completedBadges = await findAllBadgesForStudent(student.id);
    const completedFlightPlanItems =
      await findAllCompletedFlightPlanItemsForStudent(student.id);

    // Get relevant badges based on flight plan item type
    const badges = await getRelevantBadges(flightPlanItem);
    const nonCompletedBadges = filterNonCompletedBadges(
      badges,
      completedBadges,
    );

    // Process each non-completed badge
    for (const badge of nonCompletedBadges) {
      await processBadgeCompletion(
        badge,
        completedFlightPlanItems,
        user,
        student.id,
      );
    }

    return true;
  } catch (error) {
    console.error("Error in kickOffBadgeAwarding:", error);
    return false;
  }
};

const findAllBadgesForStudent = async (studentId) => {
  return await Badge.findAll({
    include: {
      model: BadgeAwarded,
      as: "badgeAwarded",
      where: {
        studentId: studentId,
      },
      required: true,
    },
  });
};

const findAllCompletedFlightPlanItemsForStudent = async (studentId) => {
  const flightPlans = await FlightPlan.findAll({
    where: { studentId: studentId },
  });

  const flightPlanItems = await FlightPlanItem.findAll({
    where: {
      flightPlanId: {
        [Op.in]: flightPlans.map((flightPlan) => flightPlan.id),
      },
      status: "Complete",
    },
  });

  return flightPlanItems;
};

// Helper Functions
const getRelevantBadges = async (flightPlanItem) => {
  const { taskId, experienceId } = flightPlanItem;

  if (taskId) {
    return await findBadgesWithTaskOrExperienceRequirement(taskId, "task");
  } else if (experienceId) {
    return await findBadgesWithTaskOrExperienceRequirement(
      experienceId,
      "experience",
    );
  }

  return [];
};

const findBadgesWithTaskOrExperienceRequirement = async (id, type) => {
  if (!type) return [];

  if (type.toLowerCase() === "task") {
    const badges = await Badge.findAll({
      include: {
        model: Task,
        where: {
          id,
        },
        required: true,
      },
    });
    return badges;
  } else if (type.toLowerCase() === "experience") {
    const badges = await Badge.findAll({
      include: {
        model: Experience,
        where: {
          id,
        },
        required: true,
      },
    });
    return badges;
  }

  return [];
};

const filterNonCompletedBadges = (badges, completedBadges) => {
  return badges.filter((badge) => !completedBadges.includes(badge));
};

const processBadgeCompletion = async (
  badge,
  completedFlightPlanItems,
  user,
  studentId,
) => {
  const isCompleted = await checkBadgeCompletion(
    badge,
    completedFlightPlanItems,
  );

  if (isCompleted) {
    await awardBadge(badge, studentId);
    await createBadgeNotification(badge, user);
  }
};

const awardBadge = async (badge, studentId) => {
  await BadgeAwarded.create({
    date: new Date(),
    badgeId: badge.id,
    studentId: studentId,
  });
};

const createBadgeNotification = async (badge, user) => {
  await Notification.create({
    header: "Badge Awarded",
    description: `You have been awarded the badge ${badge.name}`,
    userId: user.id,
    read: false,
  });
};

const checkBadgeCompletion = async (badge, completedFlightPlanItems) => {
  if (badge.ruleType === "Task and Experience Defined") {
    return checkTaskAndExperienceDefinedBadgeCompletion(
      badge,
      completedFlightPlanItems,
    );
  }

  return false;
};

const checkTaskAndExperienceDefinedBadgeCompletion = async (
  badge,
  completedFlightPlanItems,
) => {
  const badgeExpTasks = await BadExpTask.findAll({
    where: {
      badgeId: badge.id,
    },
  });

  // For a badge to be completed, all of the badgeExpTasks must have been completed by the student
  const isCompleted = badgeExpTasks.every((badgeExpTask) => {
    if (badgeExpTask.taskId) {
      return (
        getCountOfFlightPlanItemTaskOrExperience(
          completedFlightPlanItems,
          badgeExpTask.taskId,
        ) >= badgeExpTask.quantity
      );
    } else if (badgeExpTask.experienceId) {
      return (
        getCountOfFlightPlanItemTaskOrExperience(
          completedFlightPlanItems,
          badgeExpTask.experienceId,
        ) >= badgeExpTask.quantity
      );
    }
  });

  return isCompleted;
};

const getCountOfFlightPlanItemTaskOrExperience = (
  flightPlanItems,
  taskOrExperienceId,
) => {
  return flightPlanItems.filter((flightPlanItem) => {
    return (
      flightPlanItem.taskId === taskOrExperienceId ||
      flightPlanItem.experienceId === taskOrExperienceId
    );
  }).length;
};

export default kickOffBadgeAwarding;
