 
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/users.js";
import psychometricRoutes from "./routes/psychometric.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import generateRoadmapRoute from "./routes/generateRoadmap.js";
import assistantSmart from "./routes/assistant-intent-smart.js";
import paymentRoutes from "./routes/payments.js";
import appointmentRoutes from "./routes/appointments.js";
import messageRoutes from "./routes/messages.js";
import resumeRoutes from "./routes/resume.routes.js";
import initSocket from "./socket/socket.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import collegeExplore from "./routes/collegeExplore.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

/* -------------------- MIDDLEWARE -------------------- */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
  })
);

app.use(express.json());
app.options("*", cors());

/* -------------------- ROUTES -------------------- */
app.use("/api/users", userRoutes);
app.use("/api/psychometric", psychometricRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", generateRoadmapRoute);
app.use("/api/payments", paymentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/assistant-intent-smart", assistantSmart);
app.use("/api/messages", messageRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/colleges", collegeRoutes)
app.use("/api/collegesexplore",collegeExplore)
/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* -------------------- SOCKET.IO -------------------- */
// 🚨 IMPORTANT PART
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Initialize socket handlers
initSocket(io);

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5002;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});
