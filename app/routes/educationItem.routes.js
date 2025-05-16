import { Router } from "express";
import educationItem from "../controllers/educationItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new EducationItem within a specific resume section
router.post("/", [authenticate], educationItem.create);

// Get all education items for a specific section
router.get("/section/:id", [authenticate], educationItem.findAllForSection);

// Get education item by ID
router.get("/:id", [authenticate], educationItem.findOne);

// Update a EducationItem by ID
router.put("/:id", [authenticate], educationItem.update);

// Delete a EducationItem by ID
router.delete("/:id", [authenticate], educationItem.delete);

export default router;
