import Drawing from "../models/Drawing.js";
import axios from "axios";

export const getTimelineByDrawing = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult) {
      return res.status(400).json({ message: "Analysis not ready" });
    }

    const analysis = drawing.analysisResult;

    // 🔹 Call AI timeline API
    const aiResponse = await axios.post("http://localhost:8000/timeline", {
      analysis:analysis
    });

    res.json(aiResponse.data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};