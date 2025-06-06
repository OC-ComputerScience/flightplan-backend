import db from "../models/index.js";
const Student = db.student;
const FlightPlan = db.flightPlan;
const FlightPlanItem = db.flightPlanItem;
const Task = db.task;
const Experience = db.experience;
const Event = db.event;
const Semester = db.semester;
const Op = db.Sequelize.Op;
const User = db.user;
const Major = db.major;

const exports = {};

exports.findStudentForUserId = async (userId) => {
  return await Student.findOne({
    where: { userId },
    include: [{ model: Major, as: "majors" }],
  });
};

exports.getStudentWithFlightPlanInfo = async (studentId) => {
  const whereCondition = { id: studentId };
  const includes = [
    {
      model: FlightPlan,
      include: [
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
          order: [["semestersFromGrad", "ASC"]],
        },
        {
          model: Semester,
          as: "semester",
        },
      ],
    },
  ];

  return await Student.findOne({ where: whereCondition, include: includes });
};

exports.create = async (studentData) => {
  // Check if a student already exists for this userId
  const existingStudent = await Student.findOne({
    where: { userId: studentData.userId },
  });
  if (existingStudent) {
    // Update the existing student with new information
    await Student.update(studentData, {
      where: { id: existingStudent.id },
    });
    // Return the updated student
    return await Student.findByPk(existingStudent.id);
  }

  return await Student.create(studentData);
};

exports.findAll = async ({
  id,
  email,
  filter,
  offset = 0,
  limit = 10000000,
}) => {
  let condition = null;

  if (filter) {
    condition = {
      [Op.or]: [
        { "$user.fName$": { [Op.like]: `%${filter}%` } },
        { "$user.lName$": { [Op.like]: `%${filter}%` } },
        { "$user.fullName$": { [Op.like]: `%${filter}%` } },
        { "$user.email$": { [Op.like]: `%${filter}%` } },
      ],
    };
  } else if (id) {
    condition = {
      [Op.or]: [{ "$user.id$": { [Op.like]: `%${id}%` } }],
    };
  } else if (email) {
    condition = {
      [Op.or]: [{ "$user.email$": { [Op.like]: `%${email}%` } }],
    };
  }

  return await Student.findAndCountAll({
    where: {}, // No conditions on Student
    offset,
    limit,
    include: [{ model: User, as: "user", required: true, where: condition }],
  });
};

exports.findById = async (id) => {
  return await Student.findByPk(id, {
    include: [{ model: User, as: "user" }],
  });
};

exports.update = async (id, updateData) => {
  return await Student.update(updateData, { where: { id } });
};

exports.delete = async (id) => {
  return await Student.destroy({ where: { id } });
};

exports.findStudentForFlightPlanId = async (flightPlanId) => {
  const flightPlan = await FlightPlan.findByPk(flightPlanId);
  return await Student.findOne({
    where: { id: flightPlan.studentId },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
};

exports.addPoints = async (studentId, points) => {
  const student = await Student.findByPk(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const newPoints = student.pointsAwarded + points;

  return await Student.update(
    { pointsAwarded: newPoints },
    { where: { id: studentId } },
  );
};

exports.updatePoints = async (studentId, points) => {
  const student = await Student.findByPk(studentId);
  const newPoints = student.pointsAwarded + points;
  return await Student.update(
    { pointsAwarded: newPoints },
    { where: { id: studentId } },
  );
};

exports.getPoints = async (studentId) => {
  const student = await Student.findByPk(studentId);
  return student.pointsAwarded - student.pointsUsed;
};

exports.getStudent = async (studentId) => {
  const student = await Student.findByPk(studentId);
  return student;
};

exports.addMajor = async (studentId, majorId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new Error("Student not found");
  }
  return await student.addMajor(majorId);
};

exports.removeMajor = async (studentId, majorId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new Error("Student not found");
  }
  return await student.removeMajor(majorId);
};

exports.addStrength = async (studentId, strengthId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new Error("Student not found");
  }
  return await student.addStrength(strengthId);
};

exports.removeStrength = async (studentId, strengthId) => {
  const student = await Student.findByPk(studentId);
  if (!student) {
    throw new Error("Student not found");
  }
  return await student.removeStrength(strengthId);
};

export default exports;
