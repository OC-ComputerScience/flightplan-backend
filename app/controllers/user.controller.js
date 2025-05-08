import UserUtils from "../sequelizeUtils/user.js";

const exports = {};

// Create and Save a new User
exports.create = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({ message: "Email cannot be empty!" });
  }

  await UserUtils.create(req.body)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      }),
    );
};

exports.findAll = async (req, res) => {
  await UserUtils.findAll(req.query)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      }),
    );
};

exports.findAllForAdmin = async (req, res) => {
  await UserUtils.findAllForAdmin(req.query)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      }),
    );
};

exports.findAllAdmins = async (req, res) => {
  await UserUtils.findAllAdmins()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      }),
    );
};

exports.findOne = async (req, res) => {
  await UserUtils.findById(req.params.id)
    .then((data) => {
      if (data) res.send(data);
      else
        res
          .status(404)
          .send({ message: `User with id=${req.params.id} not found.` });
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error retrieving User with id=${req.params.id}` }),
    );
};

exports.findByEmail = async (req, res) => {
  await UserUtils.findByEmail(req.params.email)
    .then((data) => res.send(data || { email: "not found" }))
    .catch(() =>
      res.status(500).send({
        message: `Error retrieving User with email=${req.params.email}`,
      }),
    );
};

exports.update = async (req, res) => {
  await UserUtils.update(req.params.id, req.body)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "User updated successfully." });
      } else {
        res.send({
          message: `User with id=${req.params.id} not found or no updates provided.`,
        });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error updating User with id=${req.params.id}` }),
    );
};

exports.delete = async (req, res) => {
  await UserUtils.delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({ message: "User deleted successfully!" });
      } else {
        res.send({ message: `User with id=${req.params.id} not found.` });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ message: `Error deleting User with id=${req.params.id}` }),
    );
};

exports.promoteToAdmin = async (req, res) => {
  try {
    // Get the user
    const user = await UserUtils.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id=${req.params.id} not found.`,
      });
    }

    // Add admin role
    const updatedUser = await UserUtils.addRole(user.id, "Admin");

    res.status(200).json({
      success: true,
      message: "User promoted to admin successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error promoting user to admin",
      error: error.message,
    });
  }
};

exports.demoteFromAdmin = async (req, res) => {
  try {
    // Get the user
    const user = await UserUtils.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id=${req.params.id} not found.`,
      });
    }

    // Remove admin role
    const updatedUser = await UserUtils.removeRole(user.id, "Admin");

    res.status(200).json({
      success: true,
      message: "User demoted from admin successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error demoting user from admin",
      error: error.message,
    });
  }
};

export default exports;
