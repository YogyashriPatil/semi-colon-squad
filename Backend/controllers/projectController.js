import Project from "../models/Project.js";
import Drawing from "../models/Drawing.js";
import Timeline from "../models/Timeline.js";
import Estimation from "../models/Estimation.js";
// 🔹 Create Project
export const createProject = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("REQ USER:", req.user); // 👈 ADD TH
    // if (!req.user) {
    //   return res.status(401).json({ message: "User not authorized" });
    // }
    const { projectName, location, projectType } = req.body;
    console.log(req.user._id)
    const project = await Project.create({
      projectName,
      location,
      projectType,
      createdBy: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get All Projects (Only logged in user)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const drawings = await Drawing.find({ projectId });
    const estimations = await Estimation.find({
      drawingId: { $in: drawings.map(d => d._id) }
    });

    const timelines = await Timeline.find({
      estimationId: { $in: estimations.map(e => e._id) }
    });

    const totalCost = estimations.reduce(
      (sum, e) => sum + e.costBreakdown.totalCost,
      0
    );

    const totalDuration = timelines.reduce((sum, t) => {
      const lastPhase = t.phases[t.phases.length - 1];
      return sum + (lastPhase?.durationDays || 0);
    }, 0);

    res.json({
      drawingCount: drawings.length,
      totalCost,
      totalDuration,
      estimations,
      timelines
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
};