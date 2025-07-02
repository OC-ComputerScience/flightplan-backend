import { Router } from "express";
import email from "../controllers/email.controller.js";

const router = Router();

router.post("/send-notification", email.sendNotification);

export default router;
