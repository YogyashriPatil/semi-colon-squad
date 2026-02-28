import Drawing from "../models/Drawing.js";
import Estimation from "../models/Estimation.js";
import Timeline from "../models/Timeline.js";
import axios from "axios";

// import Pipeliine from "../models/Pipeline.js"
export const generateReport = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);
    const estimation = await Estimation.findOne({ drawingId });
    const timeline = await Timeline.findOne({ drawingId });
    // const pipeline = await Pipeliine.findOne({ drawingId })
    const reportData = {
      analysis: drawing.analysisResult,
      estimation: estimation?.estimate,
      timeline: timeline?.phases
      // ,      pipeline:pipeline?.pipeline
    };

    const aiRes = await axios.post("http://localhost:8000/report", reportData);

    res.json(aiRes.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};