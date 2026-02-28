import Drawing from "../models/Drawing.js";
import axios from "axios";

export const generatePipeline = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult)
      return res.status(400).json({ message: "Analysis missing" });

    const aiRes = await axios.post("http://localhost:8000/pipeline", {
      analysis: drawing.analysisResult
    });

    res.json(aiRes.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};