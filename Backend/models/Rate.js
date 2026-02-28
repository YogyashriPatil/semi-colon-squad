import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
  material: String,
  budget: Number,
  standard: Number,
  premium: Number,
  unit: String
});

export default mongoose.model("Rate", rateSchema);