import link from "../controllers/link.controller.js";
import { Router } from "express";

const router = Router();

// Retrieve all notifications for a user
router.get("/user/:id", link.findAllLinksForStudent);

export default router;
