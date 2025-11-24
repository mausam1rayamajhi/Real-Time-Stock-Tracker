// backend/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

console.log("🔍 FINNHUB_API_KEY loaded?", !!process.env.FINNHUB_API_KEY);

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/api", stockRoutes);

app.get("/api/test", (req, res) => {
  res.send(" Backend is working!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Backend running on http://localhost:${PORT}`);
});
