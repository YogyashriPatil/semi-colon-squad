import express from "express";
import protect from "../middleware/authMiddleware.js";
import { exportProjectPDF } from "../controllers/reportController.js";

const router = express.Router();

router.get("/:projectId/export", protect, exportProjectPDF);

export default router;