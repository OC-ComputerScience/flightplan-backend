import db from "../models/index.js";
import { Op } from "sequelize";
const Task = db.task;
const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;
const exports = {};

exports.findAllTasks = async (
  page,
  pageSize,
  searchQuery = "",
  filters = {},
) => {
  const whereCondition = {};

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.category) {
    whereCondition.category = { [Op.eq]: `${filters.category}` };
  }

  if (filters.taskType) {
    whereCondition.taskType = { [Op.eq]: `${filters.taskType}` };
  }

  if (filters.schedulingType) {
    whereCondition.schedulingType = { [Op.eq]: `${filters.schedulingType}` };
  }

  if (filters.submissionType) {
    whereCondition.submissionType = { [Op.eq]: `${filters.submissionType}` };
  }

  const direction =
    filters?.sortDirection?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  if (
    filters.semestersFromGraduation &&
    filters.sortAttribute == "semestersFromGraduation"
  ) {
    if (direction == "ASC") {
      whereCondition.semestersFromGraduation = {
        [Op.lte]: `${filters.semestersFromGraduation}`,
      };
    } else {
      whereCondition.semestersFromGraduation = {
        [Op.gte]: `${filters.semestersFromGraduation}`,
      };
    }
  }

  let order = [];

  if (
    filters.sortAttribute &&
    filters.sortDirection &&
    filters.sortAttribute != "semestersFromGraduation"
  ) {
    // Default to ascending order if direction is not provided
    order = [[filters.sortAttribute, direction]];
  }

  let queryOptions = {};

  if (page && pageSize) {
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    queryOptions = {
      offset,
      limit,
      where: whereCondition,
      order,
    };
  } else {
    queryOptions = {
      where: whereCondition,
      order,
    };
  }

  const tasks = await Task.findAll(queryOptions);

  const count = await Task.count({
    where: whereCondition, // Apply the search condition to the count as well
  });

  const totalPages = Math.ceil(count / pageSize);

  return { tasks, count: totalPages };
};

exports.findAllOptionalForStudentId = async (studentId, searchQuery) => {
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
          flightPlanItemType: "Task",
        },
      },
    ],
  });

  const flightPlanItems = flightPlans.flatMap(
    (flightPlan) => flightPlan.flightPlanItems,
  );

  const taskIds = flightPlanItems.map((item) => item.taskId);

  const tasks = await Task.findAll({
    where: {
      ...(searchQuery && { name: { [Op.like]: `%${searchQuery}%` } }),
    },
  });

  const filteredTasks = tasks.filter(
    (task) => task.schedulingType === "optional" && !taskIds.includes(task.id),
  );

  return filteredTasks;
};

exports.findOneTask = async (taskId) => {
  return await Task.findByPk(taskId);
};

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.updateTask = async (taskData, taskId) => {
  return await Task.update(taskData, {
    where: { id: taskId },
  });
};

exports.deleteTask = async (taskId) => {
  return await Task.destroy({ where: { id: taskId } });
};

exports.addMajor = async (taskId, majorId) => {
  const task = await Task.findByPk(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  return await task.addMajor(majorId);
};

exports.removeMajor = async (taskId, majorId) => {
  const task = await Task.findByPk(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  return await task.removeMajor(majorId);
}

exports.getCategories = () => {
  return Task.getAttributes().category.values;
};

exports.getSchedulingTypes = () => {
  return Task.getAttributes().schedulingType.values;
};

exports.getSubmissionTypes = () => {
  return Task.getAttributes().submissionType.values;
};

export default exports;

// Non default exports

export const getAllTasksGreaterThanSemestersFromGrad = async (
  semestersFromGrad,
) => {
  return await Task.findAll({
    where: {
      semestersFromGrad: {
        [Op.gte]: semestersFromGrad,
      },
    },
  });
};
