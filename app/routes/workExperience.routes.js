import { Router } from "express";
import workExperience from "../controllers/workExperience.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/", [authenticate], workExperience.findAllForUser);

router.get("/:id", [authenticate], workExperience.findOne);

router.post("/", [authenticate], workExperience.create);

router.put("/:id", [authenticate], workExperience.update);

router.delete("/:id", [authenticate], workExperience.delete);

export default router;
