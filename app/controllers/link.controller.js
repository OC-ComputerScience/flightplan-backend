// link.controller.js
import Link from "../models/link.model.js"; // Adjust the import according to your setup

const exports = {};
exports.findAllLinksForStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    const links = await Link.findAll({
      where: { studentId },
      attributes: ["id", "websiteName", "link", "createdAt", "updatedAt"],
    });

    res.status(200).json(links); // Send the links as a response
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching links", error: err.message });
  }
};

export default exports;
