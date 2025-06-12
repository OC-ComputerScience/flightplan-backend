import { Router } from "express";
import education from "../controllers/education.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/", [authenticate], education.findAllForUser);

router.get("/:id", [authenticate], education.findOne);

router.post("/", [authenticate], education.create);

router.put("/:id", [authenticate], education.update);

router.delete("/:id", [authenticate], education.delete);

export default router;
