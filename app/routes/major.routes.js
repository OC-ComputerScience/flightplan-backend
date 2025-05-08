import express from "express";
import majorController from "../controllers/major.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = express.Router();

// Public routes
router.get("/", majorController.findAll);
router.get("/:id", majorController.findOne);

// Admin routes
router.post("/", [authenticate, isAdmin], majorController.create);
router.put("/:id", [authenticate, isAdmin], majorController.update);
router.delete("/:id", [authenticate, isAdmin], majorController.delete);

export default router;
