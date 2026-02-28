import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateEstimation } from "../controllers/estimationController.js";

const router = express.Router();

router.post("/:drawingId", protect, generateEstimation);

export default router;