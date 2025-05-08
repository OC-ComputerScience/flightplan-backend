import role from "../controllers/role.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new Role
router.post("/", [authenticate, isAdmin], role.create);

// Retrieve all Role
router.get("/", [authenticate, isAdmin], role.findAll);

// Retrieve a single Role with id
router.get("/:id", [authenticate], role.findOne);

// Update a Role with id
router.put("/:id", [authenticate, isAdmin], role.update);

// Delete a Role with id
router.delete("/:id", [authenticate, isAdmin], role.delete);

router.get("/email/:email", [authenticate], role.findAllRolesForEmail);

export default router;
