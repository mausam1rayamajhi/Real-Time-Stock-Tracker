// backend/index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

// Debug: Confirm Finnhub key is loaded
console.log("🔍 FINNHUB_API_KEY loaded?", !!process.env.FINNHUB_API_KEY);

// Port for local + Render deployment support
const PORT = process.env.PORT || 5050;

// Basic middleware
app.use(cors());
app.use(express.json());

// All API routes mounted under /api
app.use("/api", stockRoutes);

// Simple test route
app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});

// Root health check (optional)
app.get("/", (req, res) => {
  res.send("Real-Time Stock Tracker backend is running.");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
