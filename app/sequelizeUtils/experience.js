import db from "../models/index.js";
import { Op } from "sequelize";
const Experience = db.experience;
const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;

const exports = {};

exports.findAllExperiences = async (
  page = null,
  pageSize = null,
  searchQuery = "",
) => {
  const whereCondition = searchQuery
    ? {
        name: {
          [Op.like]: `%${searchQuery}%`,
        },
      }
    : {};

  // If pagination parameters are not provided, return all records
  if (!page || !pageSize) {
    const experiences = await Experience.findAll({
      where: whereCondition,
    });
    return { experiences, count: experiences.length };
  }

  // Otherwise, use pagination
  const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  const limit = parseInt(pageSize, 10);

  const experiences = await Experience.findAll({
    offset,
    limit,
    where: whereCondition,
  });

  const count = await Experience.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(count / parseInt(pageSize, 10));

  return { experiences, count: totalPages };
};

exports.findAllOptionalForStudentId = async (studentId, searchQuery = "") => {
  const flightPlans = await FlightPlan.findAll({
    where: {
      studentId: studentId,
    },
    include: [
      {
        model: FlightPlanItem,
        as: "flightPlanItems",
        required: false,
        where: {
          flightPlanItemType: "Experience",
        },
      },
    ],
  });

  const flightPlanItems = flightPlans.flatMap(
    (flightPlan) => flightPlan.flightPlanItems,
  );

  const experienceIds = flightPlanItems.map((item) => item.experienceId);

  const experiences = await Experience.findAll({
    where: {
      ...(searchQuery && { name: { [Op.like]: `%${searchQuery}%` } }),
    },
  });

  const filteredExperiences = experiences.filter(
    (experience) =>
      experience.schedulingType === "optional" &&
      !experienceIds.includes(experience.id),
  );

  return filteredExperiences;
};

exports.findOneExperience = async (experienceId) => {
  return await Experience.findByPk(experienceId);
};

exports.createExperience = async (experienceData) => {
  return await Experience.create(experienceData);
};

exports.updateExperience = async (experienceData, experienceId) => {
  return await Experience.update(experienceData, {
    where: { id: experienceId },
  });
};

exports.deleteExperience = async (experienceId) => {
  return await Experience.destroy({ where: { id: experienceId } });
};

exports.getCategories = () => {
  return Experience.getAttributes().category.values;
};

exports.getExperienceTypes = () => {
  return Experience.getAttributes().experienceType.values;
};

exports.getSchedulingTypes = () => {
  return Experience.getAttributes().schedulingType.values;
};

exports.getSubmissionTypes = () => {
  return Experience.getAttributes().submissionType.values;
};

exports.addStrength = async (experienceId, strengthId) => {
  const experience = await Experience.findByPk(experienceId);
  if (!experience) {
    throw new Error("Experience not found");
  }
  return await experience.addStrength(strengthId);
};

exports.removeStrength = async (experienceId, strengthId) => {
  const experience = await Experience.findByPk(experienceId);
  if (!experience) {
    throw new Error("Experience not found");
  }
  // Changes the return value to be more descriptive, also prevents errors for sucessful removal
  const result = await experience.removeStrength(strengthId);
  if (result === 1) {
    return { success: true, message: "Strength removed successfully." };
  } else {
    return { success: false, message: "Strength not found or already removed." };
  }
};

export default exports;

export const getAllExperiences = async () => {
  return await Experience.findAll();
};
