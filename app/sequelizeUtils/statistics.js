
import db from "../models/index.js";
import { fn, col, Op } from 'sequelize';
import SequelizeInstance from "./sequelizeInstance.js";

const FlightPlan = db.flightPlan;
const Semester = db.semester;

const exports = {};

exports.getStudentSemesterCount = async (semesterId = null) => {
  const semesterWhere = semesterId
    ? { id: semesterId }
    : {
        startDate: { [Op.lt]: new Date() },
        endDate: { [Op.gt]: new Date() },
      };

  const result = await FlightPlan.findAll({
    attributes: [
      [fn('COUNT', fn('DISTINCT', col('studentId'))), 'studentCount']
    ],
    include: [
      {
        model: Semester,
        as: "semester",
        required: true,
        where: semesterWhere,
      }
    ],
    raw: true
  });

  const studentCount = result[0]?.studentCount || 0;

  return studentCount;
}

exports.getStudentCountsForCompletedItems = async (semesterId = null) => {
  const whereSemesterClause = semesterId
    ? "s.id = :semesterId"
    : "s.startDate < NOW() AND s.endDate > NOW()";

  const result = await SequelizeInstance.query(`
  SELECT fpItemCount, COUNT(fpItemCount) AS numOfStudents
  FROM (
    SELECT fpi.flightPlanId AS fpId, COUNT(*) AS fpItemCount
    FROM flightPlanItems fpi
    JOIN flightplans fp ON fpi.flightPlanId = fp.id
    JOIN semesters s ON fp.semesterId = s.id
    WHERE ${whereSemesterClause}
      AND fpi.status = 'Complete'
    GROUP BY fpi.flightPlanId
  ) AS sub
  GROUP BY fpItemCount
  ORDER BY fpItemCount;
`, {
    type: db.Sequelize.QueryTypes.SELECT,
    replacements: semesterId ? { semesterId } : {},
  });

  return result;
}

export default exports;