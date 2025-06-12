import { Router } from "express";
import projectItem from "../controllers/projectItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new ProjectItem within a specific resume section
router.post("/", [authenticate], projectItem.create);

// Get all project items for a specific section
router.get("/section/:id", [authenticate], projectItem.findAllForSection);

// Get project item by ID
router.get("/:id", [authenticate], projectItem.findOne);

// Update a ProjectItem by ID
router.put("/:id", [authenticate], projectItem.update);

// Delete a ProjectItem by ID
router.delete("/:id", [authenticate], projectItem.delete);

export default router;
