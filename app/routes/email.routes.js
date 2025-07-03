import { Router } from "express";
import { sendNotification } from "../controllers/email.controller.js";

const router = Router();

router.post("/send-notification", sendNotification);

export default router;