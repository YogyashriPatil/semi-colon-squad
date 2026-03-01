import Drawing from "../models/Drawing.js";

export const generatePipeline = async (req, res) => {
  try {
    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult)
      return res.status(400).json({ message: "Analysis missing" });

    const analysis = drawing.analysisResult;  // ⭐ Now correct structure

    const pipeline = [];

    pipeline.push({ order: 1, stage: "Site Preparation" });
    pipeline.push({ order: 2, stage: "Foundation Work" });

    if (analysis.structureComplexity === "high") {
      pipeline.push({ order: 3, stage: "Reinforced Column Structure" });
    } else {
      pipeline.push({ order: 3, stage: "Standard Column Structure" });
    }

    pipeline.push({ order: 4, stage: "Wall Construction" });
    pipeline.push({ order: 5, stage: "Roof Slab" });

    if (analysis.rooms > 3) {
      pipeline.push({ order: 6, stage: "Advanced Plumbing" });
    } else {
      pipeline.push({ order: 6, stage: "Basic Plumbing" });
    }

    pipeline.push({ order: 7, stage: "Electrical Work" });
    pipeline.push({ order: 8, stage: "Interior Finishing" });
    pipeline.push({ order: 9, stage: "Painting" });

    // 💾 Save inside Drawing
    drawing.pipeline = pipeline;
    await drawing.save();

    res.json({ stages: pipeline });

  } catch (err) {
    console.error("Pipeline error:", err);   // ⭐ Add this for debugging
    res.status(500).json({ error: err.message });
  }
};
// 🔹 Get Pipeline
export const getPipeline = async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.drawingId);

    if (!drawing || !drawing.pipeline)
      return res.status(404).json({ message: "Pipeline not found" });

    res.json({ stages: drawing.pipeline });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};