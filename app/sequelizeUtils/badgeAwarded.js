import db from "../models/index.js";

const BadgeAwarded = db.badgeAwarded;

const exports = {};

exports.awardBadge = async (studentId, badgeId) => {
  const badgeAwarded = await BadgeAwarded.create({
    studentId,
    badgeId,
    date: new Date(),
  });
  return badgeAwarded;
};

export default exports;
