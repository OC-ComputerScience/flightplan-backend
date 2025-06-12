import db from "../models/index.js";
const Link = db.link;

const exports = {};

exports.findAllForUser = async (userId) => {
  return await Link.findAll({
    attributes: ["id", "websiteName", "link", "createdAt", "updatedAt"],
    where: {
      userId: userId,
    },
  });
};

exports.findOne = async (id) => {
  return await Link.findByPk(id);
};

exports.create = async (linkData) => {
  return await Link.create(linkData);
};

exports.update = async (linkData, id) => {
  return await Link.update(linkData, { where: { id: id } });
};

exports.delete = async (id) => {
  return await Link.destroy({ where: { id: id } });
};

export default exports;
