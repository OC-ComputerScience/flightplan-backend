import flightPlan from "../controllers/flightPlan.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new FlightPlan
router.post("/", [authenticate, isAdmin], flightPlan.create);

router.post("/generate/:id", [authenticate], flightPlan.generate);

// Get flight plan for a student for a semester from graduation
router.get("/student/:id/semestersFromGraduation", [authenticate], flightPlan.getFlightPlanForStudentAndSemester);

// Retrieve all FlightPlans
router.get("/", [authenticate], flightPlan.findAll);

// Retrieve all FlightPlans for a student
router.get("/student/:id", [authenticate], flightPlan.findFlightPlanForStudent);

router.get(
  "/progress/:id",
  [authenticate],
  flightPlan.findProgressForFlightPlan,
);

// Retrieve a single FlightPlan with id
router.get("/:id", [authenticate], flightPlan.findOne);

// Update a FlightPlan with id
router.put("/:id", [authenticate, isAdmin], flightPlan.update);

// Delete a FlightPlan with id
router.delete("/:id", [authenticate, isAdmin], flightPlan.delete);

export default router;
