import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectSummary,
  deleteProject
} from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.get("/:projectId/summary", protect, getProjectSummary);
router.delete("/:id",protect, deleteProject);
export default router;