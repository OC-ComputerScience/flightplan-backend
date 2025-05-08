import reward from "../controllers/reward.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();
// Create a new Reward
router.post("/", [authenticate, isAdmin], reward.create);

// Redeem a Reward
router.post("/redeem/:id", [authenticate], reward.redeemReward);

// Retrieve all Reward
router.get("/", [authenticate], reward.findAll);

// Retrieve a single Reward with id
router.get("/:id", [authenticate], reward.findOne);

// Retrieve all rewards earned by a student
router.get("/student/:id", [authenticate], reward.findAllRewardsForStudent);

// Update a Reward with id
router.put("/:id", [authenticate, isAdmin], reward.update);

router.post("/upload", [authenticate, isAdmin], reward.uploadImage);

router.get("/image/:fileName", [authenticate, isAdmin], reward.getImageForName);
// Delete a Reward with id
router.delete("/:id", [authenticate, isAdmin], reward.delete);

router.delete(
  "/image/:fileName",
  [authenticate, isAdmin],
  reward.deleteRewardImage,
);

export default router;
