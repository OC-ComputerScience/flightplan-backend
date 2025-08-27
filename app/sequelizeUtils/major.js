import db from "../models/index.js";
const Major = db.major;
const Op = db.Sequelize.Op;

const exports = {};

exports.findAll = async (query) => {
  const {
    page = 1,
    pageSize = 10,
    searchQuery = "",
    sortAttribute = "name",
    sortDirection = "ASC",
  } = query;

  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const where = {};
  if (searchQuery) {
    where[Op.or] = [{ name: { [Op.like]: `%${searchQuery}%` } }];
  }

  const majors = await Major.findAll({
    where,
    limit,
    offset,
    order: [[sortAttribute, sortDirection]],
  });

  const count = await Major.count({ where });
  const totalPages = Math.ceil(count / pageSize);

  return { majors, count: totalPages };
};

exports.findOne = async (id) => {
  return await Major.findByPk(id);
};

exports.findForOCMajorId = async (OCMajorId) => {
  return await Major.findOne({
    where: {
      OCMajorId: OCMajorId
    }
  })
}

exports.create = async (majorData) => {
  // Check for existing major with similar name or code (case-insensitive)
  const existingMajor = await Major.findOne({
    where: {
      [Op.or]: [{ name: { [Op.like]: majorData.name } }],
    },
  });

  if (existingMajor) {
    if (existingMajor.name.toLowerCase() === majorData.name.toLowerCase()) {
      throw new Error("A major with this name already exists");
    }
    if (existingMajor.code.toLowerCase() === majorData.code.toLowerCase()) {
      throw new Error("A major with this code already exists");
    }
  }

  return await Major.create(majorData);
};

exports.update = async (id, majorData) => {
  const major = await Major.findByPk(id);
  if (!major) {
    throw new Error("Major not found");
  }

  // Check for existing major with similar name or code (case-insensitive)
  const existingMajor = await Major.findOne({
    where: {
      [Op.or]: [{ name: { [Op.like]: majorData.name } }],
      id: { [Op.ne]: id }, // Exclude current major from check
    },
  });

  if (existingMajor) {
    if (existingMajor.name.toLowerCase() === majorData.name.toLowerCase()) {
      throw new Error("A major with this name already exists");
    }
    if (existingMajor.code.toLowerCase() === majorData.code.toLowerCase()) {
      throw new Error("A major with this code already exists");
    }
  }

  return await major.update(majorData);
};

exports.delete = async (id) => {
  const major = await Major.findByPk(id);
  if (!major) {
    throw new Error("Major not found");
  }

  // Check if any students are using this major through the association
  const studentCount = await major.countStudents();
  if (studentCount > 0) {
    throw new Error("Cannot delete major that is assigned to students");
  }

  return await major.destroy();
};

exports.findAllMajorsForTask = async () => {
  return await Major.findAllForTask();
};

exports.findAllMajorsForExperience = async () => {
  return await Major.findAllForExperience();
};

exports.findAllMajorsForStudent = async () => {
  return await Major.findAllForStudent();
};

exports.findAllMajorsForEvent = async () => {
  return await Major.findAllForEvent();
};

export default exports;
