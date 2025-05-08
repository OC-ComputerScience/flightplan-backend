import user from "../controllers/user.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Create a new User
router.post("/", [authenticate], user.create);

// Retrieve all People
router.get("/", user.findAll);

router.get("/admin", [authenticate, isAdmin], user.findAllForAdmin);

router.get("/admin/all", [authenticate], user.findAllAdmins);

// Retrieve a single User with id
router.get("/:id", [authenticate], user.findOne);

// Update a User with id
router.put("/:id", [authenticate], user.update);

// Delete a User with id
router.delete("/:id", [authenticate, isAdmin], user.delete);

// Promote a user to admin
router.put(
  "/:id/promote-to-admin",
  [authenticate, isAdmin],
  user.promoteToAdmin,
);

// Demote a user from admin
router.put(
  "/:id/demote-from-admin",
  [authenticate, isAdmin],
  user.demoteFromAdmin,
);

export default router;
