import studentReward from "../controllers/studentReward.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Retrieve all Reward
router.get("/", [authenticate], studentReward.findAll);

// Retrieve all studentRewards for a student
router.get("/student/:id", [authenticate], studentReward.findAllStudentRewardsForStudent);

// Retrieve all studentRewards for a reward
router.get("/reward/:id", [authenticate], studentReward.findAllStudentRewardsForReward);

// Retrieve all studentRewards for a student and a reward
router.get("/student/:studentId/reward/:rewardId", [authenticate], studentReward.findAllStudentRewardsForStudentAndReward);

export default router;
