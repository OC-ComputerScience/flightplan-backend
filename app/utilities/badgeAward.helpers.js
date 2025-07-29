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

import FlightPlanUtils from "../sequelizeUtils/flightPlan.js";
import FlightPlanItemUtils from "../sequelizeUtils/flightPlanItem.js";

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
    const inactiveBadges = await Badge.findAll({
      where: {
        status: "inactive"
      }
    });
    const completedFlightPlanItems =
      await findAllCompletedFlightPlanItemsForStudent(student.id);

    // Get relevant badges based on flight plan item type
    const badges = await getRelevantBadges(flightPlanItem, student);
    let nonCompletedBadges = filterBadges(
      badges,
      completedBadges,
    );
    nonCompletedBadges = filterBadges(
      badges,
      inactiveBadges,
    );

    const uniqueNonCompletedBadges = nonCompletedBadges.reduce((uniqueBadges, currentBadge) => {
      if (!uniqueBadges.some((badge) => badge.id === currentBadge.id)){
        uniqueBadges.push(currentBadge);
      }
      return uniqueBadges;
    }, []);

    // Process each non-completed badge
    for (const badge of uniqueNonCompletedBadges) {
      await processBadgeCompletion(
        badge,
        completedFlightPlanItems,
        user,
        student,
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
const getRelevantBadges = async (flightPlanItem, student) => {
  const { taskId, experienceId } = flightPlanItem;
  let badges = [];

  if (taskId) {
    badges = [...badges, ...(await findBadgesWithTaskOrExperienceRequirement(taskId, "task"))];
  } else if (experienceId) {
    badges = [...badges, ...(await findBadgesWithTaskOrExperienceRequirement(
      experienceId,
      "experience",
    ))];
  }

  const semestersFromGrad = student.flightPlans.find((flightPlan) => flightPlan.id === flightPlanItem.flightPlanId).semestersFromGrad;
  const yearsFromGrad = Math.floor((semestersFromGrad + 1) / 2)
  const yearBadges = await Badge.findAll({
    where: {
      yearsFromGrad: yearsFromGrad
    }
  });

  const badgeQuantityBadges = await Badge.findAll({
    where: {
      ruleType: 'Number of Badges'
    }
  })

  badges = [...badges, ...yearBadges, ...badgeQuantityBadges]

  return badges;
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

const filterBadges = (badges, badgesToFilterOut) => {
  return badges.filter((badge) => !badgesToFilterOut.find((completedBadge) => badge.id === completedBadge.id));
};

const processBadgeCompletion = async (
  badge,
  completedFlightPlanItems,
  user,
  student,
) => {
  const isCompleted = await checkBadgeCompletion(
    badge,
    completedFlightPlanItems, 
    student
  );

  if (isCompleted) {
    await awardBadge(badge, student.id);
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

const checkBadgeCompletion = async (badge, completedFlightPlanItems, student) => {
  if (badge.ruleType === "Experiences and Tasks") {
    return checkExperiencesAndTasksCompletion(
      badge,
      completedFlightPlanItems,
    );
  } else if (badge.ruleType === "All Tasks and Experiences for Year") {
    return checkAllTasksAndExperiencesForYearCompletion(
      badge,
      student,
    );
  } else if (badge.ruleType === "All Tasks for Year") {
    return checkAllTasksForYearCompletion(
      badge,
      student,
    );
  } else if (badge.ruleType === "Number of Tasks for Year") {
    return checkNumberOfTasksForYearCompletion(
      badge,
      student,
    );
  } else if (badge.ruleType === "Number of Badges") {
    return checkNumberOfBadgesCompletion(
      badge,
      student,
    );
  } else if (badge.ruleType === "Number of Tasks or Experiences for Year") {
    return checkNumberOfTasksOrExperiencesForYearCompletion(
      badge,
      student,
    );
  }

  return false;
};

const checkExperiencesAndTasksCompletion = async (
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

const checkAllTasksAndExperiencesForYearCompletion = async (
  badge,
  student
) => {
  let flightPlanItems = [];

  const FlightPlan1 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, badge.yearsFromGrad * 2);
  const FlightPlan2 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, (badge.yearsFromGrad * 2) - 1);
  if (!FlightPlan2) return false;
  if (FlightPlan1?.id)
    flightPlanItems = (await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan1.id, 1, 1000)).flightPlanItems;
  flightPlanItems = [...flightPlanItems, ...(await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan2.id, 1, 1000)).flightPlanItems];
  flightPlanItems = flightPlanItems.filter((flightPlanItem) => !flightPlanItem.optional)
  return flightPlanItems.every((flightPlanItem) => { return flightPlanItem.status === "Complete" })
};

const checkAllTasksForYearCompletion = async (
  badge,
  student,
) => {
  let flightPlanItems = [];

  const FlightPlan1 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, badge.yearsFromGrad * 2);
  const FlightPlan2 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, (badge.yearsFromGrad * 2) - 1);
  if (!FlightPlan2) return false;
  if (FlightPlan1?.id)
  flightPlanItems = (await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan1.id, 1, 1000)).flightPlanItems.filter((item) => item.flightPlanItemType === "Task");
  flightPlanItems = [...flightPlanItems, ...(await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan2.id, 1, 1000)).flightPlanItems.filter((item) => item.flightPlanItemType === "Task")];
  flightPlanItems = flightPlanItems.filter((flightPlanItem) => !flightPlanItem.optional)
  return flightPlanItems.every((flightPlanItem) => { return flightPlanItem.status === "Complete" })
};

const checkNumberOfTasksForYearCompletion = async (
  badge,
  student
) => {
  let flightPlanItems = [];

  const FlightPlan1 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, badge.yearsFromGrad * 2);
  const FlightPlan2 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, (badge.yearsFromGrad * 2) - 1);

  if (FlightPlan1?.id)
    flightPlanItems = (await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan1.id, 1, 1000)).flightPlanItems.filter((item) => item.flightPlanItemType === "Task" && item.status === "Complete");
  if (FlightPlan2?.id)
    flightPlanItems = [...flightPlanItems, ...((await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan2.id, 1, 1000)).flightPlanItems).filter((item) => item.flightPlanItemType === "Task" && item.status === "Complete")];
  return flightPlanItems.length >= badge.completionQuantityOne;
};

const checkNumberOfBadgesCompletion = async (
  badge,
  student,
) => {
  const completedBadges = await findAllBadgesForStudent(student.id);
  return completedBadges.length >= badge.completionQuantityOne;
};

const checkNumberOfTasksOrExperiencesForYearCompletion = async (
  badge,
  student,
) => {
  let flightPlanItems = [];

  const FlightPlan1 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, badge.yearsFromGrad * 2);
  const FlightPlan2 = await FlightPlanUtils.getFlightPlanForStudentAndSemester(student.id, (badge.yearsFromGrad * 2) - 1);
  if (FlightPlan1?.id)
    flightPlanItems = (await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan1.id, 1, 1000)).flightPlanItems.filter((item) => item.status === "Complete");
  if (FlightPlan2?.id)
    flightPlanItems = [...flightPlanItems, ...((await FlightPlanItemUtils.findAllFlightPlanItemsByFlightPlanId(FlightPlan2.id, 1, 1000)).flightPlanItems).filter((item) => item.status === "Complete")];
  return flightPlanItems.length >= badge.completionQuantityOne;
};

export default kickOffBadgeAwarding;
