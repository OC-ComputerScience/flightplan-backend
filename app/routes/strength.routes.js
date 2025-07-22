import strengths from "../controllers/strength.controller.js";
import { Router } from "express";

const router = Router();

router.get(
  "/student/:id",
  (req, res, next) => {

    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForStudent,
);

router.get(
  "/experience/:id",
  (req, res, next) => {
  
    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForExperience,
);

router.get(
  "/task/:id",
  (req, res, next) => {
  
    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForTask,
);

router.get(
  "/event/:id",
  (req, res, next) => {

    next(); // Make sure to pass control to the next middleware
  },
  strengths.getStrengthsForEvent,
);

router.get("/", strengths.getAllStrengths);

export default router;
