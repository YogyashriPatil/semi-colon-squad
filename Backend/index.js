import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import projectRoutes from "./routes/projectRoutes.js";
import drawingRoutes from "./routes/drawingRoutes.js";
import estimationRoutes from "./routes/estimationRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import rateRoutes from "./routes/rateRoutes.js";
dotenv.config();
connectDB(); 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
// console.log(projectRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/drawings",drawingRoutes);
app.use("/api/estimation",estimationRoutes);
app.use("/api/timeline",timelineRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/rates",rateRoutes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})