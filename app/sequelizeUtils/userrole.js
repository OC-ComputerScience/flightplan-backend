import db from "../models/index.js";
const UserRole = db.userRole;
const Role = db.role;

const exports = {};

exports.createUserRole = async (userRoleData) => {
  if (userRoleData.userId === undefined) {
    const error = new Error("User ID cannot be empty for user role!");
    error.statusCode = 400;
    throw error;
  } else if (userRoleData.roleId === undefined) {
    const error = new Error("Role ID cannot be empty for user role!");
    error.statusCode = 400;
    throw error;
  }

  // make sure we don't create a duplicate value
  let existingUserRole = await this.findOneForUserForRole(
    userRoleData.userId,
    userRoleData.roleId,
  );
  if (existingUserRole[0] !== undefined) {
    return existingUserRole[0].dataValues;
  } else {
    // Create a userrole
    const userrole = {
      id: userRoleData.id,
      status: userRoleData.status ? userRoleData.status : "applied",
      agree: userRoleData.agree ? userRoleData.agree : false,
      dateSigned: userRoleData.dateSigned,
      userId: userRoleData.userId,
      roleId: userRoleData.roleId,
    };

    // Save userrole in the database
    return await UserRole.create(userrole);
  }
};

exports.findOneUserRole = async (id) => {
  return await UserRole.findByPk(id);
};

exports.findAllUserRoles = async () => {
  return await UserRole.findAll({ include: ["user"] });
};

exports.findAllRolesForUser = async (userId) => {
  return await UserRole.findAll({
    where: {
      userId: userId,
    },
    include: {
      model: Role,
      attributes: ["type"],
    },
  });
};

exports.updateUserRole = async (userrole, id) => {
  return await UserRole.update(userrole, {
    where: { id: id },
  });
};

exports.deleteUserRole = async (id) => {
  return await UserRole.destroy({
    where: { id: id },
  });
};

exports.findOneForUserForRole = async (userId, roleId) => {
  return await UserRole.findAll({
    where: { userid: userId, roleId: roleId },
  });
};

export default exports;
