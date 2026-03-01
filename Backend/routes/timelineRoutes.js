import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getTimelineByDrawing,generateTimeline } from "../controllers/timelineController.js";

const router = express.Router();
router.post("/:drawingId", protect, generateTimeline);
router.get("/:drawingId", protect, getTimelineByDrawing);

export default router;