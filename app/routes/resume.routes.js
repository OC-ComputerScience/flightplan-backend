import { Router } from "express";
import resume from "../controllers/resume.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = Router();

router.get("/", [authenticate], resume.findAllForUser);

router.get("/review", [authenticate, isAdmin], resume.findAllForReview);

router.get("/:id", [authenticate], resume.findOne);

router.post("/", [authenticate], resume.create);

router.put("/:id", [authenticate], resume.update);

router.delete("/:id", [authenticate], resume.delete);

export default router;
