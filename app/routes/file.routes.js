import { Router } from "express";
import file from "../controllers/file.controller.js";
import { authenticate } from "../authorization/authorization.js";

const router = Router();

router.get("/:fileName", [authenticate], file.getFileForName);

router.post("/upload", [authenticate], file.uploadFile);

router.delete("/:fileName", [authenticate], file.deleteFile);

export default router;
