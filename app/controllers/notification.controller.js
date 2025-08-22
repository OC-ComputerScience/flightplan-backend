import Notification from "../sequelizeUtils/notification.js";

const exports = {};

exports.create = async (req, res) => {
  await Notification.createNotification(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the notification.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Notification.findOneNotification(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find notification with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving notification with id = " + req.params.id,
      });
      console.log("Could not find notification: " + err);
    });
};

exports.findAll = async (req, res) => {
  await Notification.findAllNotifications(req.query.page, req.query.pageSize)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
};

exports.findAllNotificationsForUser = async (req, res) => {
  await Notification.findAllNotificationsForUser(
    req.params.id,
    req.query.page,
    req.query.pageSize,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
};

exports.findAllNotificationsForUserWithoutPagination = async (req, res) => {
  await Notification.findAllNotificationsForUserWithoutPagination(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving notifications.",
      });
    });
};

exports.update = async (req, res) => {
  const { userId, notificationId } = req.params; // Extract userId and notificationId from route params

  try {
    // Update the notification based on userId and notificationId
    const num = await Notification.updateNotification(
      req.body,
      notificationId,
      userId,
    );

    if (num[0] === 1) {
      // `num[0]` is the count of affected rows
      res.send({
        message: "Notification updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update notification with id = ${notificationId} for user = ${userId}. Maybe the notification was not found or req.body was empty.`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating notification with id = " + notificationId,
    });
    console.log("Error updating notification:", err);
  }
};

exports.delete = async (req, res) => {
  await Notification.deleteNotification(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete notification with id = ${req.params.id}. Maybe notification was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete notification with id = " + req.params.id,
      });
      console.log("Could not delete notification: " + err);
    });
};

exports.bulkDelete = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        message: "Please provide an array of notification IDs",
      });
    }

    const result = await Notification.bulkDelete(notificationIds);

    return res.status(200).json({
      message: "Notifications successfully deleted",
      count: result,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        "Some error occurred while bulk deleting notifications",
    });
  }
};

export default exports;
