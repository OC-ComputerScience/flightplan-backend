import majorController from "../controllers/major.controller.js";
import { Router } from "express";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = Router();

// Public routes
router.get("/", majorController.findAll);
router.get("/:id", majorController.findOne);
router.get(
    "/task/:id", 
    (req, res, next) => {
       
        next(); // Make sure to pass control to the next middleware
    },
    majorController.getMajorsForTask,
);
router.get("/", majorController.getAllMajors);
router.get(
  "/experience/:id",
  (req, res, next) => {
    
    next(); // Make sure to pass control to the next middleware
  },
  majorController.getMajorsForExperience,
);
router.get(
  "/student/:id",
  (req, res, next) => {
    
    next(); // Make sure to pass control to the next middleware
  },
  majorController.getMajorsForStudent,
);
router.get(
  "/event/:id",
  (req, res, next) => {
    
    next(); // Make sure to pass control to the next middleware
  },
  majorController.getMajorsForEvent,
);

// Admin routes
router.post("/", [authenticate, isAdmin], majorController.create);
router.put("/:id", [authenticate, isAdmin], majorController.update);
router.delete("/:id", [authenticate, isAdmin], majorController.delete);

export default router;
