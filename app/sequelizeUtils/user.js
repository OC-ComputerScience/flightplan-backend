import db from "../models/index.js";
const User = db.user;
const Student = db.student;
const Major = db.major;
const Role = db.role;
const Op = db.Sequelize.Op;

const exports = {};

exports.create = async (userData) => {
  userData.fullName = userData.fName + " " + userData.lName;
  return await User.create(userData);
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
        { fName: { [Op.like]: `%${filter}%` } },
        { lName: { [Op.like]: `%${filter}%` } },
        { fullName: { [Op.like]: `%${filter}%` } },
        { email: { [Op.like]: `%${filter}%` } },
      ],
    };
  } else if (id) {
    condition = { id: { [Op.like]: `%${id}%` } };
  } else if (email) {
    condition = { email: { [Op.like]: `%${email}%` } };
  }

  return await User.findAndCountAll({
    where: condition,
    offset,
    limit,
    include: [{ model: Student, as: "student", required: false }],
  });
};

exports.findAllForAdmin = async ({
  page = 1,
  pageSize = 10,
  searchQuery = "",
}) => {
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * limit;
  let condition = null;
  if (searchQuery) {
    condition = {
      [Op.or]: [
        { fName: { [Op.like]: `%${searchQuery}%` } },
        { lName: { [Op.like]: `%${searchQuery}%` } },
        { fullName: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
      ],
    };
  }

  const users = await User.findAll({
    where: condition,
    offset,
    limit,
    include: [
      {
        model: Student,
        as: "student",
        include: Major,
      },
      {
        model: Role,
      },
    ],
  });

  let count = await User.count({
    where: condition,
  });

  count = Math.ceil(count / pageSize);
  return { users, count };
};

exports.findAllAdmins = async () => {
  return await User.findAll({
    include: {
      model: Role,
      required: true,
      where: {
        name: "Admin",
      },
    },
  });
};

exports.findById = async (id) => {
  return await User.findByPk(id);
};

exports.findByEmail = async (email) => {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) return null;
  return await User.findOne({
    where: { email: normalized },
    include: [{ model: Student, as: "student", required: false }],
  });
};

exports.findByEmails = async (emails = []) => {
  const normalized = [
    ...new Set(
      (emails || [])
        .map((email) => String(email || "").trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
  if (normalized.length === 0) return [];

  const withAliases = new Set(normalized);
  for (const email of normalized) {
    if (email.endsWith("@eagles.oc.edu")) {
      withAliases.add(email.replace(/@eagles\.oc\.edu$/, "@oc.edu"));
    } else if (email.endsWith("@oc.edu")) {
      withAliases.add(`${email.slice(0, -"@oc.edu".length)}@eagles.oc.edu`);
    }
  }

  return await User.findAll({
    where: { email: { [Op.in]: [...withAliases] } },
    include: [{ model: Student, as: "student", required: false }],
  });
};

exports.update = async (id, updateData) => {
  return await User.update(updateData, { where: { id } });
};

exports.delete = async (id) => {
  return await User.destroy({ where: { id } });
};

exports.findByStudentId = async (studentId) => {
  return await User.findOne({ where: { studentId } });
};

exports.addRole = async (userId, roleName) => {
  // Find the user
  const user = await User.findByPk(userId, {
    include: [Role],
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find the role
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  // Add the role to the user
  await user.addRole(role);

  // Return the updated user with roles
  return await User.findByPk(userId, {
    include: [Role],
  });
};

exports.removeRole = async (userId, roleName) => {
  // Find the user
  const user = await User.findByPk(userId, {
    include: [Role],
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find the role
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  // Remove the role from the user
  await user.removeRole(role);

  // Return the updated user with roles
  return await User.findByPk(userId, {
    include: [Role],
  });
};

export default exports;
