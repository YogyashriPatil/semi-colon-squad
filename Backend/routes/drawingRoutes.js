import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadDrawing } from "../controllers/drawingController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("drawing"), uploadDrawing);

export default router;