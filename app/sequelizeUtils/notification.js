import db from "../models/index.js";
const Notification = db.notification;
const User = db.user;

const exports = {};

exports.findAllNotifications = async (page = 1, pageSize = 10) => {
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return await Notification.findAll({
    limit,
    offset,
  });
};

exports.findAllNotificationsForUser = async (
  userId,
  page = 1,
  pageSize = 10,
) => {
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize;

  const { count, rows } = await Notification.findAndCountAll({
    where: { userId },
    attributes: [
      "header",
      "description",
      "actionLink",
      "read",
      "id",
      "createdAt",
    ],
    include: {
      model: User,
    },
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset,
  });

  return { notifications: rows, total: count };
};

exports.findAllNotificationsForUserWithoutPagination = async (userId) => {
  const notifications = await Notification.findAll({
    where: { userId },
    attributes: [
      "header",
      "description",
      "actionLink",
      "read",
      "id",
      "createdAt",
    ],
    include: {
      model: User,
    },
    order: [["createdAt", "DESC"]],
  });

  return { notifications };
};

exports.findOneNotification = async (notificationId) => {
  return await Notification.findByPk(notificationId);
};

exports.createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

exports.updateNotification = async (
  notificationData,
  notificationId,
  userId,
) => {
  return await Notification.update(notificationData, {
    where: { id: notificationId, userId: userId }, // Ensure both IDs match
  });
};
exports.deleteNotification = async (notificationId) => {
  return await Notification.destroy({ where: { id: notificationId } });
};

export default exports;
