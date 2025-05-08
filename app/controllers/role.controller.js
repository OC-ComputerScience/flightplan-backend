import Role from "../sequelizeUtils/role.js";

const exports = {};

exports.create = async (req, res) => {
  await Role.createRole(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the role.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Role.findOneRole(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find role with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving role with id = " + req.params.id,
      });
      console.log("Could not find role: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Role.findAllRoles()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving roles.",
      });
    });
};

exports.findAllRolesForEmail = async (req, res) => {
  await Role.findAllRolesForEmail(req.params.email)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving roles.",
      });
    });
};

exports.update = async (req, res) => {
  await Role.updateRole(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Role was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update role with id = ${req.params.id}. Maybe role was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating role with id = " + req.params.id,
      });
      console.log("Could not update role: " + err);
    });
};

exports.delete = async (req, res) => {
  await Role.deleteRole(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Role was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete role with id = ${req.params.id}. Maybe role was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete role with id = " + req.params.id,
      });
      console.log("Could not delete role: " + err);
    });
};

export default exports;
