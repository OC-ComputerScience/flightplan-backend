import { Router } from "express";
import colleagueController from "../controllers/colleague.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/getStudentForEmail", [authenticate], colleagueController.getStudentForEmail);

router.get("/getStudentForOCStudentId", [authenticate], colleagueController.getStudentForOCStudentId);

router.post("/createNewStudentForUserId/:id", [authenticate], colleagueController.createNewStudentForUserId);

router.put("/checkUpdateStudentWithColleagueDataForStudentId/:id", [authenticate], colleagueController.checkUpdateStudentWithColleagueDataForStudentId);

export default router;