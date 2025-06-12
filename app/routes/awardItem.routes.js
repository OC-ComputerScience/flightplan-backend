import { Router } from "express";
import awardItem from "../controllers/awardItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new AwardItem within a specific resume section
router.post("/", [authenticate], awardItem.create);

// Get all award items for a specific section
router.get("/section/:id", [authenticate], awardItem.findAllForSection);

// Get award item by ID
router.get("/:id", [authenticate], awardItem.findOne);

// Update a AwardItem by ID
router.put("/:id", [authenticate], awardItem.update);

// Delete a AwardItem by ID
router.delete("/:id", [authenticate], awardItem.delete);

export default router;
