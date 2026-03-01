import mongoose from "mongoose";

const pipelineSchema = new mongoose.Schema(
{
  drawingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drawing",
    required: true
  },

  stages: [
    {
      order: Number,
      stage: String,
      effort: Number,
      status: String
    }
  ]
},
{ timestamps: true }
);

export default mongoose.model("Pipeline", pipelineSchema);