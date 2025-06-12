import { Router } from "express";
import skill from "../controllers/skill.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/user/:id", [authenticate], skill.findAllForUser);

router.get("/:id", [authenticate], skill.findOne);

router.post("/", [authenticate], skill.create);

router.put("/:id", [authenticate], skill.update);

router.delete("/:id", [authenticate], skill.delete);

export default router;
