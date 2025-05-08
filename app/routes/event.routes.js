import event from "../controllers/event.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Event
router.post("/", [authenticate, isAdmin], event.create);

// Retrieve all Events
router.get("/", [authenticate], event.findAll);

// Retrieve a single Event with id
router.get("/:id", [authenticate], event.findOne);

// Retrieve a single Event with a check-in token
router.get("/token/:eventToken", [authenticate], event.findByToken);

// Update a Event with id
router.put("/:id", [authenticate, isAdmin], event.update);

// Delete a Event with id
router.delete("/:id", [authenticate, isAdmin], event.delete);

router.get(
  "/types/registrationTypes",
  [authenticate],
  event.getRegistrationTypes,
);

router.get("/types/attendanceTypes", [authenticate], event.getAttendanceTypes);

router.get("/types/completionTypes", [authenticate], event.getCompletionTypes);

// Register students for an event
router.post("/:id/register", [authenticate], event.registerStudents);

router.delete("/:id/unregister", [authenticate], event.unregisterStudents);

router.get(
  "/student/:studentId/registered-events",
  event.getRegisteredEventsForStudent,
);

router.get(
  "/student/:studentId/attending-events",
  event.getAttendingEventsForStudent,
);

// Mark attendance for students at an event
router.post("/:id/attend", [authenticate], event.markAttendance);

// Retrieve registered students for an event
router.get(
  "/:id/registered-students",
  [authenticate],
  event.getRegisteredStudents,
);

// Retrieve attending students for an event
router.get(
  "/:id/attending-students",
  [authenticate],
  event.getAttendingStudents,
);

// Get flight plan items that can be fulfilled by an event
router.get(
  "/:eventId/fulfillableFlightPlanItems/:studentId",
  [authenticate],
  event.getEventFulfillableExperiences,
);

router.get(
  "/experience/:experienceId/fulfilling-events",
  [authenticate],
  event.getEventsForExperience,
);

// Generate a check-in token for an event
router.post(
  "/:eventId/check-in-token",
  [authenticate, isAdmin],
  event.generateCheckInToken,
);

// Get the current check-in token for an event
router.get(
  "/:eventId/check-in-token",
  [authenticate, isAdmin],
  event.getCheckInToken,
);

// Student check-in to event using token
router.post(
  "/:eventId/check-in/:studentId",
  [authenticate],
  event.checkInStudent,
);

// Import attendance from CSV
router.post(
  "/:eventId/import-attendance",
  [authenticate, isAdmin],
  event.importAttendance,
);

// Import attendance data
router.post(
  "/import-attendance",
  [authenticate, isAdmin],
  event.importAttendance,
);

export default router;
