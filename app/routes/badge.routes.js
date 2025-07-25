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

// Retrieve all active badges
router.get("/active", [authenticate], badge.findAllActiveBadges);

// Retrieve all inactive badges
router.get("/inactive", [authenticate], badge.findAllInactiveBadges);

// Retrieve a single Role with id
router.get("/:id", [authenticate], badge.findOne);

// Retrieve all rule types
router.get("/types/rules", [authenticate], badge.getRuleTypes);

// Retrieve all status types
router.get("/types/statusTypes", [authenticate], badge.getStatusTypes);

// Retrieve all unviewed badges for a student
router.get("/student/:id/unviewed", [authenticate], badge.getUnviewedBadges);

// View a badge
router.put("/:id/view", [authenticate], badge.viewBadge);

// Update a Role with id
router.put("/:id", [authenticate, isAdmin], badge.update);

// Route to get badges for a student
router.get("/student/:id", [authenticate], badge.findAllBadgesForStudent);

export default router;
