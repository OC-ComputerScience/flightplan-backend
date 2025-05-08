import db from "../models/index.js";
const Role = db.role;
const User = db.user;

const exports = {};

exports.createRole = async (roleData) => {
  if (roleData.type === undefined) {
    const error = new Error("Type cannot be empty for role!");
    error.statusCode = 400;
    throw error;
  }

  // Create a role
  const role = {
    id: roleData.id,
    type: roleData.type,
  };

  // Save role in the database
  return await Role.create(role);
};

exports.findAllRoles = async () => {
  return await Role.findAll();
};

exports.findAllRolesForEmail = async (email) => {
  return await Role.findAll({
    include: { model: User, required: true, where: { email } },
  });
};

exports.findOneRole = async (id) => {
  return await Role.findByPk(id);
};

exports.updateRole = async (role, id) => {
  return await Role.update(role, {
    where: { id: id },
  });
};

exports.deleteRole = async (id) => {
  return await Role.destroy({
    where: { id: id },
  });
};

export default exports;
