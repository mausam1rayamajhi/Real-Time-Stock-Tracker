// backend/routes/stockRoutes.js

const express = require("express");
const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;

const router = express.Router();

const API_KEY = process.env.FINNHUB_API_KEY;
const FINN = "https://finnhub.io/api/v1";

if (!API_KEY) {
  console.warn(" FINNHUB_API_KEY is not set. Finnhub routes will fail.");
}

//  Quote Endpoint (Finnhub)
router.get("/quote/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const { data } = await axios.get(`${FINN}/quote`, {
      params: { symbol, token: API_KEY },
    });

    // data.c = current price, data.pc = previous close
    if (typeof data.c !== "number") {
      return res.status(500).json({ error: "Invalid quote data from Finnhub." });
    }

    let percentChange = null;
    if (typeof data.pc === "number" && data.pc !== 0) {
      percentChange = ((data.c - data.pc) / data.pc) * 100;
    }

    res.json({
      price: data.c,
      percentChange, // can be null
    });
  } catch (err) {
    console.error("Quote error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get quote." });
  }
});

// Company Profile (Finnhub)
router.get("/profile/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const { data } = await axios.get(`${FINN}/stock/profile2`, {
      params: { symbol, token: API_KEY },
    });

    res.json(data);
  } catch (err) {
    console.error("Profile error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get company profile." });
  }
});

// 🔵 Search by Company Name / Symbol (Finnhub)
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;

    const { data } = await axios.get(`${FINN}/search`, {
      params: { q: query, token: API_KEY },
    });

    res.json(data.result);
  } catch (err) {
    console.error("Search error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to search companies." });
  }
});

// 🟣 Intraday 1-Min Candles (Finnhub)
router.get("/chartdata/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60; // last 60 minutes

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
    console.error("Intraday candles error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch intraday candles." });
  }
});


//  Daily Candles via yahoo-finance2 (using historical())
router.get("/candles/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    // Last 30 days
    const period2 = new Date();
    const period1 = new Date(period2.getTime() - 30 * 24 * 60 * 60 * 1000);

    // yahooFinance.v2 -> use historical()
    const results = await yahooFinance.historical(symbol, {
      period1,
      period2,
      interval: "1d",
    });

    if (!Array.isArray(results) || results.length === 0) {
      return res
        .status(400)
        .json({ error: "No daily candle data available." });
    }

    // Convert array of objects into arrays (o,h,l,c,v,t) like a "candles" response
    const o = [];
    const h = [];
    const l = [];
    const c = [];
    const v = [];
    const t = [];

    results.forEach((bar) => {
      o.push(bar.open);
      h.push(bar.high);
      l.push(bar.low);
      c.push(bar.close);
      v.push(bar.volume);
      // send seconds since epoch (frontend turns into dates)
      t.push(Math.floor(new Date(bar.date).getTime() / 1000));
    });

    res.json({
      o,
      h,
      l,
      c,
      v,
      t,
      s: "ok",
    });
  } catch (err) {
    console.error("Daily candles error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
