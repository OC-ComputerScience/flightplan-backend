import db from "../models/index.js";
import { Op } from "sequelize";

const Semester = db.semester;
const FlightPlan = db.flightPlan;

const TERMS = ["fall", "winter", "spring", "summer"];
const SORT_ATTRIBUTES = ["startDate", "endDate", "year", "term", "id"];

const exports = {};

const normalizeSemesterData = (semesterData = {}) => ({
  term: String(semesterData.term || "").toLowerCase(),
  year: String(semesterData.year || "").trim(),
  startDate: semesterData.startDate,
  endDate: semesterData.endDate,
});

const validateSemesterData = ({ term, year, startDate, endDate }) => {
  if (!TERMS.includes(term)) {
    throw new Error("Term must be fall, winter, spring, or summer");
  }
  if (!/^\d{4}$/.test(year)) {
    throw new Error("Year must be a 4-digit year");
  }
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  if (new Date(endDate) <= new Date(startDate)) {
    throw new Error("End date must be after start date");
  }
};

exports.findAllSemesters = async () => {
  return await Semester.findAll({
    where: {
      endDate: {
        [Op.gt]: Date.now(),
      },
    },
  });
};

exports.findAllSemestersUnfiltered = async () => {
  return await Semester.findAll({
    order: [["startDate", "ASC"]],
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

exports.getNextSemester = async () => {
  return await Semester.findOne({
    where:{
      startDate: {
        [Op.gt]: new Date(),
      },
    },
    order: [['startDate', 'ASC']],
  })
}

exports.findAllForAdmin = async (query = {}) => {
  const {
    page = 1,
    pageSize = 10,
    searchQuery = "",
    sortAttribute = "startDate",
    sortDirection = "ASC",
  } = query;

  const sort = SORT_ATTRIBUTES.includes(sortAttribute)
    ? sortAttribute
    : "startDate";
  const direction =
    String(sortDirection).toUpperCase() === "DESC" ? "DESC" : "ASC";
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * limit;

  const where = {};
  if (searchQuery) {
    where[Op.or] = [
      { term: { [Op.like]: `%${searchQuery}%` } },
      { year: { [Op.like]: `%${searchQuery}%` } },
    ];
  }

  const { rows, count } = await Semester.findAndCountAll({
    where,
    limit,
    offset,
    order: [["startDate", "ASC"], [sort, direction]],
  });

  return { semesters: rows, count: Math.ceil(count / limit) };
};

exports.findOne = async (id) => {
  return await Semester.findByPk(id);
};

exports.create = async (semesterData) => {
  const data = normalizeSemesterData(semesterData);
  validateSemesterData(data);

  const existingSemester = await Semester.findOne({
    where: { term: data.term, year: data.year },
  });
  if (existingSemester) {
    throw new Error("A semester with this term and year already exists");
  }

  return await Semester.create(data);
};

exports.update = async (id, semesterData) => {
  const semester = await Semester.findByPk(id);
  if (!semester) {
    throw new Error("Semester not found");
  }

  const data = normalizeSemesterData(semesterData);
  validateSemesterData(data);

  const existingSemester = await Semester.findOne({
    where: {
      term: data.term,
      year: data.year,
      id: { [Op.ne]: id },
    },
  });
  if (existingSemester) {
    throw new Error("A semester with this term and year already exists");
  }

  await semester.update(data);
  return 1;
};

exports.delete = async (id) => {
  const semester = await Semester.findByPk(id);
  if (!semester) {
    throw new Error("Semester not found");
  }

  const flightPlanCount = await FlightPlan.count({ where: { semesterId: id } });
  if (flightPlanCount > 0) {
    throw new Error("Cannot delete a semester that has flight plans");
  }

  await semester.destroy();
  return 1;
};

export default exports;
