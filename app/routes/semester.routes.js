import semester from "../controllers/semester.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";
import { Router } from "express";

const router = Router();

// Retrieve all semesters
router.get("/", [authenticate], semester.findAll);
router.get("/all", [authenticate], semester.findAllUnfiltered);
router.get("/admin", [authenticate, isAdmin], semester.findAllForAdmin);
router.get("/:id", [authenticate], semester.findOne);

router.post("/", [authenticate, isAdmin], semester.create);
router.put("/:id", [authenticate, isAdmin], semester.update);
router.delete("/:id", [authenticate, isAdmin], semester.delete);

export default router;
