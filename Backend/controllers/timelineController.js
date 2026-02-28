import Estimation from "../models/Estimation.js";
import Timeline from "../models/Timeline.js";

export const generateTimeline = async (req, res) => {
  try {
    const { estimationId , projectStartDate } = req.body;

    const estimation = await Estimation.findById(estimationId);

    if (!estimation)
      return res.status(404).json({ message: "Estimation not found" });

    const { concrete, bricks } = estimation.quantities;

    // Simple productivity logic
    const excavationDays = 5;
    const foundationDays = Math.ceil(concrete / 5);
    const brickworkDays = Math.ceil(bricks / 1000);

    const phasesRaw = [
      { phaseName: "Excavation", durationDays: excavationDays },
      { phaseName: "Foundation", durationDays: foundationDays },
      { phaseName: "Brickwork", durationDays: brickworkDays }
    ];

    // Calculate start & end days
    let currentDate = new Date(projectStartDate);
    const phases =[];
    for (let phase of phasesRaw) {
      const startDate = new Date(currentDate);

      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + phase.durationDays - 1);

      phases.push({
        phaseName: phase.phaseName,
        durationDays: phase.durationDays,
        startDate,
        endDate
      });

      // Move to next day after this phase ends
      currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }


    const timeline = await Timeline.create({
      estimationId,
      projectStartDate,
      phases
    });

    res.json(timeline);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};