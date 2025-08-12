import db from "../models/index.js";
import { Op } from "sequelize";
const Task = db.task;
const TaskMajor = db.taskMajor;
const TaskStrength = db.taskStrength;
const FlightPlanItem = db.flightPlanItem;
const FlightPlan = db.flightPlan;
const exports = {};

exports.findAllTasks = async (
  page = 1,
  pageSize = 10,
  searchQuery = "",
  filters = {}
) => {
  const whereCondition = {};

  if (searchQuery) {
    whereCondition.name = { [Op.like]: `%${searchQuery}%` };
  }

  if (filters.category) {
    whereCondition.category = filters.category;
  }

  if (filters.schedulingType) {
    whereCondition.schedulingType = filters.schedulingType;
  }

  if (filters.submissionType) {
    whereCondition.submissionType = filters.submissionType;
  }

  if (filters.semestersFromGrad !== null) {  // Changed from semestersFromGraduation
    whereCondition.semestersFromGrad = filters.semestersFromGrad;  // Changed both instances
  }

  if (filters.status) {
    whereCondition.status = filters.status;
  }

  let includeStrengths = [];
  if (filters.strengths && filters.strengths.length > 0) {
    includeStrengths = [{
      model: db.strength,
      where: {
        id: {
          [Op.in]: filters.strengths
        }
      },
      required: true
    }];
  }

  const queryOptions = {
    where: whereCondition,
    include: includeStrengths,
    order: [['createdAt', 'DESC']]
  };

  if (filters.sortAttribute && filters.sortDirection) {
    queryOptions.order = [[filters.sortAttribute, filters.sortDirection]];
  }

  // Add pagination
  if (page && pageSize) {
    queryOptions.offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
    queryOptions.limit = parseInt(pageSize, 10);
  }

  const { rows: tasks, count } = await Task.findAndCountAll(queryOptions);

  return {
    tasks,
    count: Math.ceil(count / pageSize)
  };
};

exports.findAllActiveTasks = async () => {
  return await Task.findAll({
    where: {
      status: "active",
    },
  });
};

exports.findAllInactiveTasks = async () => {
  return await Task.findAll({
    where: {
      status: "inactive",
    },
  });
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

export default exports;

// Non default exports
