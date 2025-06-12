import { Router } from "express";
import award from "../controllers/award.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

// Create a new award
router.post("/", [authenticate], award.create);

// Retrieve all awards
router.get("/", [authenticate], award.findAllForUser);

// Retrieve a single award with id
router.get("/:id", [authenticate], award.findOne);

// Update a award with id
router.put("/:id", [authenticate], award.update);

// Delete a award with id
router.delete("/:id", [authenticate], award.delete);

export default router;
