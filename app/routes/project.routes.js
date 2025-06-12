import { Router } from "express";
import project from "../controllers/project.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/", [authenticate], project.findAllForUser);

router.get("/:id", [authenticate], project.findOne);

router.post("/", [authenticate], project.create);

router.put("/:id", [authenticate], project.update);

router.delete("/:id", [authenticate], project.delete);

export default router;
