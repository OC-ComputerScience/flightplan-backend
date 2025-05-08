import badge from "../controllers/badge.controller.js";
import badgeAwarded from "../controllers/badgeAwarded.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Role
router.post("/", [authenticate, isAdmin], badge.create);

router.post("/award", [authenticate, isAdmin], badgeAwarded.awardBadge);

// Retrieve all Role
router.get("/", [authenticate], badge.findAll);

// Retrieve a single Role with id
router.get("/:id", [authenticate], badge.findOne);

// Retrieve all rule types
router.get("/types/rules", [authenticate], badge.getRuleTypes);

// Retrieve all unviewed badges for a student
router.get("/student/:id/unviewed", [authenticate], badge.getUnviewedBadges);

// View a badge
router.put("/:id/view", [authenticate], badge.viewBadge);

// Update a Role with id
router.put("/:id", [authenticate, isAdmin], badge.update);

// Route to get badges for a student
router.get("/student/:id", [authenticate], badge.findAllBadgesForStudent);

// Delete a Role with id
router.delete("/:id", [authenticate, isAdmin], badge.delete);

export default router;
