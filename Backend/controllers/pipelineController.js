import Drawing from "../models/Drawing.js";
import Pipeline from "../models/Pipeline.js";
import axios from "axios";

// 🔹 Generate Pipeline
export const generatePipeline = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult)
      return res.status(400).json({ message: "Analysis missing" });

    const aiRes = await axios.post("http://localhost:8000/pipeline", {
      analysis: drawing.analysisResult
    });

    const pipeline = await Pipeline.findOneAndUpdate(
      { drawingId },
      { drawingId, stages: aiRes.data.pipeline },
      { new: true, upsert: true }
    );

    res.json(pipeline);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get Pipeline
export const getPipeline = async (req, res) => {
  try {
    const pipeline = await Pipeline.findOne({
      drawingId: req.params.drawingId
    });

    if (!pipeline)
      return res.status(404).json({ message: "Pipeline not found" });

    res.json(pipeline);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};