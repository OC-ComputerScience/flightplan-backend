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

router.get("/", strengths.getAllStrengths);

export default router;
