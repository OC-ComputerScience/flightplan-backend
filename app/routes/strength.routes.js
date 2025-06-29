import strengths from "../controllers/strength.controller.js";
import { Router } from "express";

const router = Router();

router.get(
  "/student/:id",
  (req, res, next) => {
    console.log("Strength route hit for student ID:", req.params.id);
    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForStudent,
);

router.get(
  "/experience/:id",
  (req, res, next) => {
    console.log("Strength route hit for experience ID:", req.params.id);
    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForExperience,
);

router.get(
  "/task/:id",
  (req, res, next) => {
    console.log("Strength route hit for task ID:", req.params.id);
    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForTask,
);

router.get(
  "/event/:id",
  (req, res, next) => {
    console.log("Strength route hit for event ID:", req.params.id);
    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForEvent,
);

router.get("/", strengths.getAllStrengths);

export default router;
