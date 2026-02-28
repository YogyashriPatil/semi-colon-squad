import mongoose from "mongoose";

const estimationSchema = new mongoose.Schema(
  {
    drawingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drawing",
      required: true
    },

    // 🔹 New dynamic estimate
    estimate: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Estimation", estimationSchema);