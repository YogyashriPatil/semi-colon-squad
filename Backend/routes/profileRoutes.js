import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getProfileStats } from "../controllers/profileController.js";

const router = express.Router();

router.get("/stats", protect, getProfileStats);

export default router;