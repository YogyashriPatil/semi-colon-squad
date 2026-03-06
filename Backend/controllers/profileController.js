import Project from "../models/Project.js";

export const getProfileStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({
      createdBy: req.user._id
    });
    
    res.json({ totalProjects });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};