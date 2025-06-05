import majorController from "../controllers/major.controller.js";
import { Router } from "express";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = Router();

// Public routes
router.get("/", majorController.findAll);
router.get("/:id", majorController.findOne);
router.get(
  "/experience/:id",
  (req, res, next) => {
    console.log("Major route hit for experience ID:", req.params.id);
    next(); // Make sure to pass control to the next middleware
  },
  majorController.getMajorsForExperience,
);

// Admin routes
router.post("/", [authenticate, isAdmin], majorController.create);
router.put("/:id", [authenticate, isAdmin], majorController.update);
router.delete("/:id", [authenticate, isAdmin], majorController.delete);

export default router;
