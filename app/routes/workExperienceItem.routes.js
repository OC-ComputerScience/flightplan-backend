import { Router } from "express";
import workExperienceItem from "../controllers/workExperienceItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new ExperienceItem within a specific resume section
router.post("/", [authenticate], workExperienceItem.create);

// Get all experience items for a specific section
router.get(
  "/section/:id",
  [authenticate],
  workExperienceItem.findAllForSection,
);

// Get experience item by ID
router.get("/:id", [authenticate], workExperienceItem.findOne);

// Update a ExperienceItem by ID
router.put("/:id", [authenticate], workExperienceItem.update);

// Delete a ExperienceItem by ID
router.delete("/:id", [authenticate], workExperienceItem.delete);

export default router;
