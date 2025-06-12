import { Router } from "express";
import template from "../controllers/template.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/:id", [authenticate], template.findOne);

export default router;
