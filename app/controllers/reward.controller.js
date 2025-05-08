import Reward from "../sequelizeUtils/reward.js";
import FileHelpers from "../utilities/fileStorage.helper.js";

const exports = {};

exports.create = async (req, res) => {
  await Reward.createReward(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward.",
      });
    });
};

exports.findOne = async (req, res) => {
  await Reward.findOneReward(req.params.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find reward with id = ${req.params.id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving reward with id = " + req.params.id,
      });
      console.log("Could not find reward: " + err);
    });
};

exports.findAll = async (req, res) => {
  const {
    page,
    pageSize,
    searchQuery,
    redemptionType,
    sortAttribute,
    sortDirection,
  } = req.query;

  await Reward.findAllRewards(page, pageSize, searchQuery, {
    redemptionType,
    sortAttribute,
    sortDirection,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

exports.findAllRewardsForStudent = async (req, res) => {
  await Reward.findAllRewardsForStudent()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rewards.",
      });
    });
};

exports.update = async (req, res) => {
  await Reward.updateReward(req.body, req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Reward was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update reward with id = ${req.params.id}. Maybe reward was not found or req.body was empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating reward with id = " + req.params.id,
      });
      console.log("Could not update reward: " + err);
    });
};

exports.delete = async (req, res) => {
  await Reward.deleteReward(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Reward was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete reward with id = ${req.params.id}. Maybe reward was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete reward with id = " + req.params.id,
      });
      console.log("Could not delete reward: " + err);
    });
};

exports.uploadImage = async (req, res) => {
  try {
    await FileHelpers.upload(req, res);
    res.status(200).send({ fileName: req.savedFileName });
  } catch (err) {
    res.status(400).send({ message: "Failed to upload image" });
  }
};

exports.getImageForName = async (req, res) => {
  try {
    const response = await FileHelpers.read(req.params.fileName);
    res.status(200).send({ image: response });
  } catch (err) {
    res.status(404).send({ message: "Couldn't find image" });
  }
};

exports.deleteRewardImage = async (req, res) => {
  try {
    await FileHelpers.remove(req.params.fileName);
    res.status(200).send({
      message: `Successfully deleted image with name: ${req.params.fileName}`,
    });
  } catch (err) {
    res.status(400).send({
      message: `There was an error deleting image with name: ${req.params.fileName}`,
    });
  }
};

exports.redeemReward = async (req, res) => {
  try {
    console.log(req.params.id, req.body.studentId, req.body.userId);
    const result = await Reward.redeemReward(
      req.params.id,
      req.body.studentId,
      req.body.userId,
    );
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log("Could not redeem reward: " + err);
    res.status(500).json({
      message: "Error redeeming reward with id = " + req.params.id,
      error: err.message,
    });
  }
};

export default exports;
