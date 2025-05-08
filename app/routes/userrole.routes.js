import userrole from "../controllers/userrole.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new PersonRole
router.post("/", [authenticate, isAdmin], userrole.create);

// Retrieve all PersonRole
router.get("/", [authenticate, isAdmin], userrole.findAll);

// Retrieve all PersonRole for a given user
router.get("/user/:userId", [authenticate], userrole.findAllForUser);

// Retrieve a single PersonRole with id
router.get("/:id", [authenticate], userrole.findOne);

// Update a PersonRole with id
router.put("/:id", [authenticate, isAdmin], userrole.update);

// Delete a PersonRole with id
router.delete("/:id", [authenticate, isAdmin], userrole.delete);

export default router;
