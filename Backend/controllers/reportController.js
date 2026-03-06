import Drawing from "../models/Drawing.js";
import Estimation from "../models/Estimation.js";
import Timeline from "../models/Timeline.js";
import Pipeline from "../models/Pipeline.js";
import axios from "axios";

export const generateReport = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);
    const estimation = await Estimation.findOne({ drawingId });
    const timeline = await Timeline.findOne({ drawingId });
    const pipeline = await Pipeline.findOne({ drawingId });

    const reportData = {
      analysis: drawing?.analysisResult || {},
      estimation: estimation?.estimate || {},
      timeline: timeline?.phases || [],
      pipeline: pipeline?.stages || []
    };

    const aiRes = await axios.post("http://localhost:8000/report", reportData);

    res.json(aiRes.data);

  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: err.message });
  }
};