import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import itemRoutes from "./routes/items.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* =========================
   CRITICAL MONGOOSE SETTINGS
   ========================= */
mongoose.set("bufferCommands", false);

/* =========================
   MIDDLEWARE
   ========================= */
app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
   ========================= */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // 🚨 STOP SERVER IF DB FAILS
  }
};

/* =========================
   START SERVER ONLY AFTER DB
   ========================= */
const startServer = async () => {
  await connectDB();

  // Routes (ONLY after DB is connected)
  app.use("/api/items", itemRoutes);
  app.use("/api/history", historyRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      dbState: mongoose.connection.readyState, // should be 1
    });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

export default app;
