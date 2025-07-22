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

export default exports;
