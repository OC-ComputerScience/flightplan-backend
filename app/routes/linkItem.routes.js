import { Router } from "express";
import linkItem from "../controllers/linkItem.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new LinkItem within a specific resume section
router.post("/", [authenticate], linkItem.create);

// Get all link items for a specific section
router.get("/section/:id", [authenticate], linkItem.findAllForSection);

// Get link item by ID
router.get("/:id", [authenticate], linkItem.findOne);

// Update a LinkItem by ID
router.put("/:id", [authenticate], linkItem.update);

// Delete a LinkItem by ID
router.delete("/:id", [authenticate], linkItem.delete);

export default router;
