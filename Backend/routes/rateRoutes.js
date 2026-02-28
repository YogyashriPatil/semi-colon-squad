import express from "express";
import protect from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { updateRate } from "../controllers/rateController.js";

const router = express.Router();

router.put("/update", protect, adminOnly, updateRate);

export default router;