import semester from "../controllers/semester.controller.js";
import { authenticate } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Retrieve all semesters
router.get("/", [authenticate], semester.findAll);
router.get("/all", [authenticate], semester.findAllUnfiltered);

export default router;
