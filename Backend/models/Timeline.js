import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema({
  phase: String,
  durationDays: Number
});

const timelineSchema = new mongoose.Schema({
  drawingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drawing",
    required: true
  },
  phases: [phaseSchema],
  totalDuration: Number
});

export default mongoose.model("Timeline", timelineSchema);