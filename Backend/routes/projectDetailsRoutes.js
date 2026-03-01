import express from "express";
import Project from "../models/Project.js";
import Drawing from "../models/Drawing.js";
import Estimation from "../models/Estimation.js";
import Timeline from "../models/Timeline.js";
import Pipeline from "../models/Pipeline.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, async (req, res) => {
  try {

    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    const drawing = await Drawing.findOne({ projectId });

    let estimation = null;
    let timeline = null;
    let pipeline = null;

    if (drawing) {

      estimation = await Estimation.findOne({
        drawingId: drawing._id
      });

      timeline = await Timeline.findOne({
        drawingId: drawing._id
      });

      pipeline = await Pipeline.findOne({
        drawingId: drawing._id
      });

    }

    res.json({
      project,
      drawing,
      estimation,
      timeline,
      pipeline
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch details" });
  }
});

export default router;