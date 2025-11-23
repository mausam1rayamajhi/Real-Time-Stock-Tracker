// backend/stockRoutes.js

const express = require("express");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;
const router = express.Router();

const API_KEY = process.env.FINNHUB_API_KEY;
const FINN = "https://finnhub.io/api/v1";

// 🟢 Quote Endpoint (Finnhub)
router.get("/quote/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { data } = await axios.get(`${FINN}/quote`, {
      params: { symbol, token: API_KEY },
    });
    const percentChange = ((data.c - data.pc) / data.pc) * 100;
    res.json({ price: data.c, percentChange: percentChange.toFixed(2) });
  } catch (err) {
    console.error("Quote error:", err.message);
    res.status(500).json({ error: "Failed to get quote." });
  }
});

// 🟠 Company Profile (Finnhub)
router.get("/profile/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const { data } = await axios.get(`${FINN}/stock/profile2`, {
      params: { symbol, token: API_KEY },
    });
    res.json(data);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ error: "Failed to get company profile." });
  }
});

// 🔵 Search by Company Name (Finnhub)
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { data } = await axios.get(`${FINN}/search`, {
      params: { q: query, token: API_KEY },
    });
    res.json(data.result);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Failed to search companies." });
  }
});

// 🟣 Intraday 1-Min Candles (Finnhub)
router.get("/chartdata/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60;

    const { data } = await axios.get(`${FINN}/stock/candle`, {
      params: {
        symbol,
        resolution: "1",
        from,
        to,
        token: API_KEY,
      },
    });

    if (data.s !== "ok" || !Array.isArray(data.t)) {
      return res.status(400).json({ error: "No intraday data available." });
    }

    res.json({
      o: data.o,
      h: data.h,
      l: data.l,
      c: data.c,
      v: data.v,
      t: data.t,
      s: data.s,
    });
  } catch (err) {
    console.error("Intraday candles error:", err.message);
    res.status(500).json({ error: "Failed to fetch intraday candles." });
  }
});

// 🔴 Daily Candles via Yahoo-Finance2
router.get("/candles/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const period2 = new Date();
    const interval = "1d";

    const result = await yahooFinance.candles(symbol, {
      period1,
      period2,
      interval,
    });

    const { open, high, low, close, volume, timestamp, status } = result;

    if (!Array.isArray(timestamp) || timestamp.length === 0) {
      return res.status(400).json({ error: "No daily candle data available." });
    }

    res.json({
      o: open,
      h: high,
      l: low,
      c: close,
      v: volume,
      t: timestamp,
      s: status || "ok",
    });
  } catch (err) {
    console.error("Daily candles error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
