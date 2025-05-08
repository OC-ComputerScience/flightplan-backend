import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.uploadFile = async (req, res) => {
  try {
    await FileHelpers.upload(req, res);
    res.status(200).send({ fileName: req.savedFileName });
  } catch (err) {
    res.status(400).send({ message: err.message || "Failed to upload" });
  }
};

exports.getFileForName = async (req, res) => {
  try {
    const response = FileHelpers.read(req.params.fileName);
    res.status(200).send({ image: response });
  } catch (err) {
    res.status(404).send({ message: "Couldn't find image" });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    FileHelpers.remove(req.params.fileName);
    res.status(200).send({
      message: `Successfully deleted image with name: ${req.params.fileName}`,
    });
  } catch (err) {
    res.status(400).send({
      message: `There was an error deleting image with name: ${req.params.fileName}`,
    });
  }
};

export default exports;
