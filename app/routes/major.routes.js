import express from "express";
import majorController from "../controllers/major.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = express.Router();

// Public routes
router.get("/", majorController.findAll);
router.get("/:id", majorController.findOne);
router.get(
    "/task/:id", 
    (req, res, next) => {
        console.log("Major route hit for task ID:", req.params.id);
        next(); // Make sure to pass control to the next middleware
    },
    majorController.getMajorsForTask,
);
router.get("/", majorController.getAllMajors);

// Admin routes
router.post("/", [authenticate, isAdmin], majorController.create);
router.put("/:id", [authenticate, isAdmin], majorController.update);
router.delete("/:id", [authenticate, isAdmin], majorController.delete);

export default router;
