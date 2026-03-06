import Drawing from "../models/Drawing.js";
import Project from "../models/Project.js";
import axios from "axios";
import path from "path";

export const uploadDrawing = async (req, res) => {
  try {

    const { projectId } = req.params;

    // ✅ Check file uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Check project ownership
    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Save drawing initially
    const drawing = await Drawing.create({
      projectId,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      status: "processing"
    });

    // ✅ Fix Windows path
    const safePath = path.resolve(drawing.filePath).replace(/\\/g, "/");

    console.log("Sending to AI:", safePath);

    // ✅ Call AI microservice
    const aiResponse = await axios.post("http://localhost:8000/analyze", {
      filePath: safePath
    });

    /*
      AI RETURNS:
      {
        analysis: {...},
        timeline: {
          phases: [],
          totalDuration
        }
      }
    */

    const { analysis, timeline } = aiResponse.data;

    // ✅ Save correct structure
    drawing.analysisResult = analysis;

    if (timeline) {
      drawing.timeline = {
        phases: timeline?.phases || [],
        totalDuration: timeline?.totalDuration || 0
      };
    }

    drawing.filePath = safePath;
    drawing.status = "completed";

    await drawing.save();

    // ✅ Send correct frontend structure
    res.status(201).json({
      _id: drawing._id,
      analysis: {
        analysis: drawing.analysisResult,
        timeline: drawing.timeline
      }
    });

  } catch (error) {
    console.error("Upload Drawing Error:", error);
    res.status(500).json({ error: error.message });
  }
};