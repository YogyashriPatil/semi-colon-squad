import mongoose from "mongoose";

const estimationSchema = new mongoose.Schema(
  {
    drawingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drawing",
      required: true
    },
    quantities: {
      concrete: Number,
      steel: Number,
      bricks: Number
    },
    costBreakdown: {
      concreteCost: Number,
      steelCost: Number,
      brickCost: Number,
      totalCost: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Estimation", estimationSchema);