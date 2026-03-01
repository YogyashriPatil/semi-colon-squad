import Drawing from "../models/Drawing.js";
import Timeline from "../models/Timeline.js";
import axios from "axios";
import mongoose from "mongoose";

// 🔹 GENERATE + SAVE TIMELINE
export const generateTimeline = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult) {
      return res.status(400).json({ message: "Analysis not ready" });
    }

    // 🤖 Call Python AI
    const aiResponse = await axios.post("http://localhost:8000/timeline", {
      analysis: drawing.analysisResult
    });
    console.log("ai respone :" +aiResponse)
    const aiTimeline = aiResponse.data;

    // 💾 Save to DB
    const timeline = await Timeline.findOneAndUpdate(
      { drawingId },
      {
        drawingId,
        phases: aiTimeline.phases,
        totalDuration: aiTimeline.totalDuration
      },
      { returnDocument: "after", upsert: true }
    );

    res.json(timeline);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET SAVED TIMELINE
export const getTimelineByDrawing = async (req, res) => {
  try {
    const timeline = await Timeline.findOne({
      drawingId: req.params.drawingId
    });

    if (!timeline)
      return res.status(404).json({ message: "Timeline not found" });

    res.json(timeline);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};