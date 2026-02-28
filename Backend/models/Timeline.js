import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema({
  phaseName: String,
  durationDays: Number,
  startDate: Date,
  endDate: Date
});

const timelineSchema = new mongoose.Schema(
  {
    estimationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estimation",
      required: true
    },
    projectStartDate: Date,
    phases: [ phaseSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Timeline", timelineSchema);