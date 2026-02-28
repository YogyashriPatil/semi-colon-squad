import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generatePipeline } from "../controllers/pipelineController.js";

const router = express.Router();

router.post("/:drawingId", protect, generatePipeline);

export default router;