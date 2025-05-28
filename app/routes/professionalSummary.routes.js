import { Router } from "express";
import professionalSummary from "../controllers/professionalSummary.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/", [authenticate], professionalSummary.findAllForUser);

router.get("/:id", [authenticate], professionalSummary.findOne);

router.get(
  "/resume/:resumeId",
  [authenticate],
  professionalSummary.findAllForResume,
);

router.post("/", [authenticate], professionalSummary.create);

router.put("/:id", [authenticate], professionalSummary.update);

router.delete("/:id", [authenticate], professionalSummary.delete);

export default router;
