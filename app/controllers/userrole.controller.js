import UserRole from "../sequelizeUtils/userrole.js";

const exports = {};
exports.create = async (req, res) => {
  await UserRole.createUserRole(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user role.",
      });
    });
};

exports.findOne = async (req, res) => {
  await UserRole.findOneUserRole(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find user role with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving user role with id = " + req.params.id,
      });
    });
};

exports.findAll = async (req, res) => {
  await UserRole.findAllUserRoles()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user roles.",
      });
    });
};

exports.findAllForUser = async (req, res) => {
  const { userId } = req.params;

  await UserRole.findAllRolesForUser(userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user roles.",
      });
    });
};

exports.update = async (req, res) => {
  await UserRole.updateUserRole(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User role was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update user role with id = ${req.params.id}. Maybe user role was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating user role with id = " + req.params.id,
      });
    });
};

exports.delete = async (req, res) => {
  await UserRole.deleteUserRole(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User role was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete user role with id = ${req.params.id}. Maybe user role was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Could not delete user role with id = " + req.params.id,
      });
    });
};

export default exports;
