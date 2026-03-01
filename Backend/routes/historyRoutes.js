import express from "express";
import Project from "../models/Project.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET USER PROJECT HISTORY
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
    console.log("project " + projects)
    res.json(projects);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

export default router;