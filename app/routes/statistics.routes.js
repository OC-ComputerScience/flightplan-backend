import { Router } from "express";
import statistics from "../controllers/statistics.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/getStudentSemesterCount", [authenticate], statistics.getStudentSemesterCount);

router.get("/getStudentCountsForCompletedItems", [authenticate], statistics.getStudentCountsForCompletedItems);

export default router;
