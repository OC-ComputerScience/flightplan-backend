import { Router } from "express";
import skillItem from "../controllers/skillItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new SkillItem within a specific resume section
router.post("/", [authenticate], skillItem.create);

// Get all skill items for a specific section
router.get("/section/:id", [authenticate], skillItem.findAllForSection);

// Get skill item by ID
router.get("/:id", [authenticate], skillItem.findOne);

// Update a SkillItem by ID
router.put("/:id", [authenticate], skillItem.update);

// Delete a SkillItem by ID
router.delete("/:id", [authenticate], skillItem.delete);

export default router;
