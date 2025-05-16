import link from "../controllers/link.controller.js";
import { Router } from "express";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Retrieve all notifications for a user
router.get("/user/:id", [authenticate], link.findAllForUser);

router.get("/:id", [authenticate], link.findOne);

router.post("/", [authenticate], link.create);

router.put("/:id", [authenticate], link.update);

router.delete("/:id", [authenticate], link.delete);

export default router;
