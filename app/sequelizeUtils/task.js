import db from "../models/index.js";
import { Op } from "sequelize";
const Task = db.task;
const TaskMajor = db.taskMajor;
const TaskStrength = db.taskStrength;
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

exports.findAllActiveTasks = async () => {
  return await Task.findAll({
    where: {
      status: "active",
    },
  });
};

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

exports.addMajor = async (taskId, majorId) => {
  let taskMajor = {
    taskId: taskId,
    majorId: majorId,
  }
  
  return await TaskMajor.create(taskMajor);
};

exports.removeMajor = async (taskId, majorId) => {
  
  const result = await TaskMajor.destroy({
    where: {
      taskId: taskId,
      majorId: majorId,
    },
  });
  if (result === 1) {
    return { success: true, message: "Major removed successfully." };
  } else {
    return {success: false, message: "Major not found or already removed."};
  }
}

exports.addStrength = async (taskId, strengthId) => {
  let taskStrength = {
    taskId: taskId,
    strengthId: strengthId,
  }

  return await TaskStrength.create(taskStrength);
};

exports.removeStrength = async (taskId, strengthId) => {

  const result = await TaskStrength.destroy({
    where: {
      taskId: taskId,
      strengthId: strengthId,
    },
  });
  if (result === 1) {
    return { success: true, message: "Strength removed successfully." };
  } else {
    return {success: false, message: "Strength not found or already removed."};
  }
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

exports.getStatusTypes = () => {
  return Task.getAttributes().status.values; 
}

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
