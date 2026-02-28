import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateTimeline } from "../controllers/timelineController.js";

const router = express.Router();

router.post("/generate", protect, generateTimeline);

export default router;