import submission from "../controllers/submission.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

router.post("/", [authenticate], submission.create);
router.post("/bulk", [authenticate], submission.bulkCreate);

router.get(
  "/flightPlanItem/:flightPlanItemId",
  [authenticate],
  submission.findAllForFlightPlanItem,
);

router.delete(
  "/flightPlanItem/:flightPlanItemId",
  [authenticate],
  submission.discardSubmissionForFlightPlanItem,
);

export default router;
