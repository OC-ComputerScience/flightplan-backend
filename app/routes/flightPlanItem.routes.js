import flightPlanItem from "../controllers/flightPlanItem.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new FlightPlanItem
router.post("/", [authenticate], flightPlanItem.create);

router.post(
  "/submit/:flightPlanItemId",
  [authenticate],
  flightPlanItem.createSubmission,
);

// Retrieve all FlightPlanItems
router.get("/", [authenticate], flightPlanItem.findAll);

// Retrieve FlightPlanItems by FlightPlan ID
router.get(
  "/flightplan/:flightPlanId",
  [authenticate],
  flightPlanItem.findAllFlightPlanItemsByFlightPlanId,
);

router.get("/types", [authenticate], flightPlanItem.getFlightPlanItemTypes);

router.get(
  "/statuses",
  [authenticate],
  flightPlanItem.getFlightPlanItemStatuses,
);

router.get(
  "/pendingApprovals",
  [authenticate, isAdmin],
  flightPlanItem.getPendingApprovals,
);

// Update a FlightPlanItem with id
router.put("/:id", [authenticate], flightPlanItem.update);

router.put(
  "/:id/approve",
  [authenticate, isAdmin],
  flightPlanItem.approveFlightPlanItem,
);

router.put(
  "/:id/reject",
  [authenticate, isAdmin],
  flightPlanItem.rejectFlightPlanItem,
);

// Delete a FlightPlanItem with id
router.delete("/:id", [authenticate], flightPlanItem.delete);

router.get(
  "/student/:studentId/flightplan/:flightPlanId/with-events",
  [authenticate],
  flightPlanItem.getFlightPlanItemsWithEventsForStudent,
);

export default router;
