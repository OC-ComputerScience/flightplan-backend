import { Router } from "express";
import resumeSection from "../controllers/resumeSection.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = Router();

router.get("/:resumeId", [authenticate], resumeSection.findAllForResume);

router.get(
  "/resume/:resumeId/comments",
  [authenticate, isAdmin],
  resumeSection.findAllForResumeWithComments,
);

// Get a specific resume section by ID
router.get("/:id", [authenticate], resumeSection.findOne);

// Create a new resume section for a specific resume
router.post("/", [authenticate], resumeSection.create);

// Update a specific resume section by ID
router.put("/:id", [authenticate], resumeSection.update);

// Delete a specific resume section by ID
router.delete("/:id", [authenticate], resumeSection.delete);

export default router;
