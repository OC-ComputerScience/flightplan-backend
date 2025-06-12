import { Router } from "express";
import professionalSummaryItem from "../controllers/professionalSummaryItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new ProfessionalSummaryItem within a specific resume section
router.post("/", [authenticate], professionalSummaryItem.create);

// Get all professionalSummary items for a specific section
router.get("/section/:id", [authenticate], professionalSummaryItem.findAll);

// Get professionalSummary item by ID
router.get("/:id", [authenticate], professionalSummaryItem.findOne);

// Update a ProfessionalSummaryItem by ID
router.put("/:id", [authenticate], professionalSummaryItem.update);

// Delete a ProfessionalSummaryItem by ID
router.delete("/:id", [authenticate], professionalSummaryItem.delete);

export default router;
