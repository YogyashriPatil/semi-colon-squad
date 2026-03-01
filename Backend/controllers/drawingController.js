import Drawing from "../models/Drawing.js";
import Project from "../models/Project.js";
import axios from "axios";
import path from "path";
export const uploadDrawing = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(req.params)
    console.log("Params:", req.params);
    console.log("Logged User:", req.user._id);
    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id
    });
    console.log("Matched Project:", project);

    if (!project)
      return res.status(404).json({ message: "Project not found" });
    const drawing = await Drawing.create({
      projectId,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      status: "processing"
    });
     // 🔹 Step 2: Fix Windows path
    const safePath = path.resolve(drawing.filePath).replace(/\\/g, "/");
    console.log("Sending to AI:", safePath);
    // // 🔹 Step 3: Call AI microservice
    const aiResponse = await axios.post("http://localhost:8000/analyze", {
      filePath: safePath
    });
    //  // 🔹 Step 4: Save analysis result
   
    drawing.analysisResult = aiResponse.data.analysis.analysis;
    // drawing.analysis= aiResponse.data.analysis.analysis;
    drawing.timeline= aiResponse.data.analysis.timeline;
    drawing.filePath = safePath; // optional cleanup
    drawing.status = "completed";
    await drawing.save();

    res.status(201).json({
      _id: drawing._id,
      analysis: {
        analysis : drawing.analysisResult,
        timeline: drawing.timeline
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};