import experience from "../controllers/experience.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Experience
router.post("/", [authenticate, isAdmin], experience.create);

// Retrieve all Experience
router.get("/", [authenticate], experience.findAll);

router.get(
  "/optional/:studentId",
  [authenticate],
  experience.findAllOptionalForStudentId,
);

// Retrieve a single Experience with id
router.get("/:id", [authenticate], experience.findOne);

// Update a Experience with id
router.put("/:id", [authenticate, isAdmin], experience.update);

// Delete a Experience with id
router.delete("/:id", [authenticate, isAdmin], experience.delete);

router.get("/types/categories", [authenticate], experience.getCategories);

// router.get("/types/fulfillingEvents", [authenticate], experience.getFulfillingEvents);

router.get(
  "/types/submissionTypes",
  [authenticate],
  experience.getSubmissionTypes,
);

router.get(
  "/types/schedulingTypes",
  [authenticate],
  experience.getSchedulingTypes,
);

router.get(
  "/types/submissionTypes",
  [authenticate],
  experience.getSubmissionTypes,
);

router.put("/:id/strengths", [authenticate], experience.addStrength);
router.delete("/:id/strengths", [authenticate], experience.removeStrength);

router.put("/:id/majors", [authenticate], experience.addMajor);
router.delete("/:id/majors", [authenticate], experience.removeMajor);

export default router;
