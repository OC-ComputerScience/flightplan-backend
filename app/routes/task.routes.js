import task from "../controllers/task.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Task
router.post("/", [authenticate, isAdmin], task.create);

// Retrieve a single Task with id
router.get("/:id", [authenticate], task.findOne);

// Retrieve all Tasks
router.get("/", [authenticate], task.findAll);

router.get(
  "/optional/:studentId",
  [authenticate],
  task.findAllOptionalForStudentId,
);

router.get(
  "/active",
  [authenticate],
  task.findAllActive,
);

// Update a Task with id
router.put("/:id", [authenticate, isAdmin], task.update);

router.get("/types/categories", [authenticate], task.getCategories);

router.get("/types/schedulingTypes", [authenticate], task.getSchedulingTypes);

router.get("/types/submissionTypes", [authenticate], task.getSubmissionTypes);

// TaskMajor
router.post("/:id/majors/:majorId", [authenticate, isAdmin], task.addMajor);
router.delete("/:id/majors/:majorId", [authenticate, isAdmin], task.removeMajor);

// TaskStrength
router.post("/:id/strengths/:strengthId", [authenticate, isAdmin], task.addStrength);
router.delete("/:id/strengths/:strengthId", [authenticate, isAdmin], task.removeStrength);

export default router;
