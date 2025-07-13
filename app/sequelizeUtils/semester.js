import db from "../models/index.js";
import { Op } from "sequelize";

const Semester = db.semester;

const exports = {};

exports.findAllSemesters = async () => {
  return await Semester.findAll({
    where: {
      endDate: {
        [Op.gt]: Date.now(),
      },
    },
  });
};

exports.getCurrentSemester = async () => {
  return await Semester.findOne({
    where: {
      startDate: {
        [Op.lte]: Date.now(),
      },
      endDate: {
        [Op.gte]: Date.now(),
      },
    },
  });
};

exports.createNextExpectedSemester = async () => {
  const nextExpectedSemesterData = generateNextExpectedSemesterData();

  return await Semester.create(nextExpectedSemesterData);
}

exports.getNextExpectedSemester = async () => {
  const dayWithinNextSemester = getNextSemesterStartPlusOneDay();

  return await Semester.findOne({
    where:{
      startDate: {
        [Op.lte]: dayWithinNextSemester,
      },
      endDate: {
        [Op.gte]: dayWithinNextSemester,
      },
    }
  })
}

// does not do summer terms
// gets the expected next semester start day plus one given the current date, expects fall start to be 08/01, and spring to be 01/15 
function getNextSemesterStartPlusOneDay() {
  const now = new Date();
  const year = now.getFullYear();

  const springStart = new Date(`${year}-01-15T01:00:00`);
  const fallStart = new Date(`${year}-08-01T01:00:00`);

  let nextStart;

  if (now < springStart) {
    nextStart = springStart;
  } else if (now < fallStart) {
    nextStart = fallStart;
  } else {
    nextStart = new Date(`${year + 1}-01-15T01:00:00`);
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  const result = new Date(nextStart.getTime() + oneDayMs);

  return result;
}

// does not do summer terms
// expects fall start to be 08/01, and spring to be 01/15
function generateNextExpectedSemesterData() {
  const now = new Date();
  const year = now.getFullYear();

  const springStart = new Date(`${year}-01-15T01:00:00`);
  const fallStart = new Date(`${year}-08-01T01:00:00`);

  const springEnd = new Date(`${year}-04-28T01:00:00`)
  const fallEnd = new Date(`${year}-12-15T01:00:00`)

  let nextTerm, nextYear, startDate, endDate;

  if (now < springStart) {
    nextTerm = 'spring';
    nextYear = year;
    startDate = springStart;
    endDate = springEnd;
  } else if (now < fallStart) {
    nextTerm = 'fall';
    nextYear = year;
    startDate = fallStart;
    endDate = fallEnd;
  } else {
    nextTerm = 'spring';
    nextYear = year + 1;
    startDate = new Date(`${nextYear}-01-15T01:00:00`);
    endDate = new Date(`${nextYear}-04-28T01:00:00`);
  }

  return {
    term: nextTerm,
    year: nextYear,
    startDate,
    endDate,
  };
}

export default exports;
