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
import uploadRoute from "./routes/uploadRoute.js"
import rateRoutes from "./routes/rateRoutes.js";
import pipelineRoutes from "./routes/pipelineRoutes.js"
import historyRoutes from "./routes/historyRoutes.js";
import projectDetailsRoutes from "./routes/projectDetailsRoutes.js"

dotenv.config();
connectDB(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
// console.log(projectRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/drawings",drawingRoutes);
app.use("/api/estimation",estimationRoutes);
app.use("/api/timeline",timelineRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/rates",rateRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/history",historyRoutes)
app.use("/api/project-details", projectDetailsRoutes)
app.use("/upload", uploadRoute);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})