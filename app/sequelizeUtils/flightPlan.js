// Models
import db from "../models/index.js";
const {
  flightPlan: FlightPlan,
  flightPlanItem: FlightPlanItem,
  task: Task,
  experience: Experience,
  event: Event,
  semester: Semester,
  student: Student,
} = db;

// Sequelize Utilities
import SemesterUtils from "../sequelizeUtils/semester.js";

// Helpers
import { getFlightPlanItemsForNewFlightPlan } from "../utilities/flightPlanGeneration.helpers.js";

// Module Exports Placeholder
const exports = {};

exports.findAllFlightPlans = async (page = 1, pageSize = 10) => {
  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await FlightPlan.findAll({
    limit,
    offset,
  });
};

exports.generateFlightPlan = async (studentId) => {
  if (!studentId) {
    throw Error("Unable to generate flight plan for student with invalid id");
  }

  const currentSemester = await SemesterUtils.getCurrentSemester();

  if (!currentSemester) {
    throw Error("Unable to get current semester");
  }

  const student = await Student.findByPk(studentId, {
    include: [
      {
        model: FlightPlan,
      },
    ],
  });

  if (student.flightPlans[0]?.semestersFromGrad < 0) {
    throw Error("Student semesters from graduation can't be negative");
  }
  if (student.flightPlans[0]?.semestersFromGrad === student.semestersFromGrad) {
    throw Error("Student's flight plan has already been generated");
  }

  // // This is running under the assumption that the students semestersFromGrad has already been decremented and it is the current and updated value.
  const flightPlanData = {
    studentId,
    semesterId: currentSemester.id,
    semestersFromGrad: student.semestersFromGrad,
  };
  const flightPlan = await FlightPlan.create(flightPlanData);

  const flightPlanItems = await getFlightPlanItemsForNewFlightPlan(
    studentId,
    flightPlan,
  );

  flightPlanItems.forEach(async (flightPlanItem) => {
    await FlightPlanItem.create(flightPlanItem);
  });

  return flightPlanItems;
};

exports.findFlightPlanForStudent = async (studentId) => {
  return await FlightPlan.findAll({
    where: { studentId },
    include: [
      {
        model: Semester,
        as: "semester",
      },
      {
        model: FlightPlanItem,
        include: [
          {
            model: Task,
            as: "task",
          },
          {
            model: Experience,
            as: "experience",
          },
          {
            model: Event,
            as: "event",
          },
        ],
      },
    ],
  });
};

exports.findFlightPlan = async (id) => {
  return await FlightPlan.findOne({
    where: { id },
    include: [
      {
        model: FlightPlanItem,
        attributes: ["flightPlanItemType", "status", "id"],
        include: [
          {
            model: Task,
            as: "task",
          },
          {
            model: Experience,
            as: "experience",
          },
          {
            model: Event,
            as: "event",
          },
        ],
      },
    ],
  });
};

exports.findProgressForFlightPlan = async (flightPlanId) => {
  const response = await FlightPlanItem.findAll({ where: { flightPlanId } });
  let completed = response.reduce((previous, current) => {
    return previous + (current.status == "Complete" ? 1 : 0);
  }, 0);

  const progress =
    response.length > 0 ? Math.round(100 * (completed / response.length)) : 0; // Prevent division by zero

  return { progress };
};

exports.findOneFlightPlan = async (flightPlanId) => {
  return await FlightPlan.findByPk(flightPlanId);
};

exports.createFlightPlan = async (flightPlanData) => {
  return await FlightPlan.create(flightPlanData);
};

exports.updateFlightPlan = async (flightPlanData, flightPlanId) => {
  return await FlightPlan.update(flightPlanData, {
    where: { id: flightPlanId },
  });
};

exports.deleteFlightPlan = async (flightPlanId) => {
  return await FlightPlan.destroy({ where: { id: flightPlanId } });
};

export default exports;
