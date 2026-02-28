import mongoose from "mongoose";

const drawingSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    fileName: String,
    filePath: String,
    fileType: String,
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed"],
      default: "uploaded"
    },
    analysisResult: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

export default mongoose.model("Drawing", drawingSchema);