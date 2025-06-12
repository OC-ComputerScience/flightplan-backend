import { Router } from "express";
import review from "../controllers/review.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = Router();

router.get("/resume/:resumeId", [authenticate], review.findAllForResume);

router.get("/:id", [authenticate, isAdmin], review.findOne);

router.post("/", [authenticate], review.create);

router.put("/:id", [authenticate, isAdmin], review.update);

router.delete("/:id", [authenticate, isAdmin], review.delete);

export default router;
