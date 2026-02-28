import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
  material: String,
  rate: Number,
  unit: String
});

export default mongoose.model("Rate", rateSchema);