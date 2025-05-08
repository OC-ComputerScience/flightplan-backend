import auth from "../controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

// Login
router.post("/login", auth.login);

// Authorization
router.post("/authorize/:id", auth.authorize);

// Logout
router.post("/logout", auth.logout);

// Validate Token
router.post("/validate", auth.validateToken);

export default router;
