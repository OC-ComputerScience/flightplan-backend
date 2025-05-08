import BadgeAwarded from "../sequelizeUtils/badgeAwarded.js";

const exports = {};

exports.awardBadge = async (req, res) => {
  const { studentId, badgeId } = req.body;
  try {
    const badgeAwarded = await BadgeAwarded.awardBadge(studentId, badgeId);
    res.status(200).json(badgeAwarded);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default exports;
