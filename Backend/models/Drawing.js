import mongoose from "mongoose";
const analysisSchema = new mongoose.Schema({
  walls: Number,
  columns: Number,
  doors: Number,
  windows: Number,
  floorArea: Number,
  rooms: Number,
  bathrooms: Number,
  wallLength: Number,
  slabArea: Number,
  layoutType: String,
  structureComplexity: String

}, { _id: false });
const timelineSchema = new mongoose.Schema({
  phases: [
    {
      phase: String,
      durationDays: Number
    }
  ],
  totalDuration: Number
}, { _id: false });
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
    analysisResult: analysisSchema,
    pipeline:[
      {
        order:Number,
        stage:String
      }
    ],
    timeline: timelineSchema
  },
  { timestamps: true }
);

export default mongoose.model("Drawing", drawingSchema);