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

// Update a Task with id
router.put("/:id", [authenticate, isAdmin], task.update);

// Delete a Task with id
router.delete("/:id", [authenticate, isAdmin], task.delete);

router.get("/types/categories", [authenticate], task.getCategories);

router.get("/types/schedulingTypes", [authenticate], task.getSchedulingTypes);

router.get("/types/submissionTypes", [authenticate], task.getSubmissionTypes);

router.post("/:id/majors/:majorId", [authenticate, isAdmin], task.addMajor);
router.delete("/:id/majors/:majorId", [authenticate, isAdmin], task.removeMajor);

export default router;
