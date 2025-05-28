import { Router } from "express";
import comment from "../controllers/comment.controller.js";
import { authenticate, isAdmin } from "../authorization/authorization.js";

const router = Router();

router.get(
  "/comment/review/:reviewId",
  [authenticate],
  comment.findAllForReview,
);

router.post("/comment", [authenticate, isAdmin], comment.create);

router.put("/comment/:id", [authenticate, isAdmin], comment.update);

router.delete("/comment/:id", [authenticate, isAdmin], comment.delete);

export default router;
