import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generatePipeline , getPipeline} from "../controllers/pipelineController.js";

const router = express.Router();

router.post("/:drawingId", protect, generatePipeline);
router.get("/:drawingId", protect, getPipeline);
export default router;