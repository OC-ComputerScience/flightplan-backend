import db from "../models/index.js";
const Link = db.link;

const exports = {};

exports.findAllLinksForStudent = async (studentId) => {
  return await Link.findAll({
    attributes: ["id", "websiteName", "link", "createdAt", "updatedAt"],
    where: {
      studentId: studentId,
    },
  });
};
