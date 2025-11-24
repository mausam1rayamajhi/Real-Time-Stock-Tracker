// backend/routes/stockRoutes.js

const express = require("express");
const axios = require("axios");

const router = express.Router();

// Finnhub config
const API_KEY = process.env.FINNHUB_API_KEY;
const FINN = "https://finnhub.io/api/v1";

if (!API_KEY) {
  console.warn("⚠️ FINNHUB_API_KEY is not set. Finnhub routes will fail.");
}

/**
 * GET /api/quote/:symbol
 * Current price + percent change (Finnhub)
 */
router.get("/quote/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const { data } = await axios.get(`${FINN}/quote`, {
      params: { symbol, token: API_KEY },
    });

    // data.c = current price, data.pc = previous close
    if (typeof data.c !== "number") {
      return res
        .status(500)
        .json({ error: "Invalid quote data from Finnhub." });
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

/**
 * GET /api/profile/:symbol
 * Company profile (Finnhub)
 */
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

/**
 * GET /api/search/:query
 * Search by symbol or company name (Finnhub)
 */
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

/**
 * GET /api/chartdata/:symbol
 * Intraday 1-minute candles (last 60 minutes) – Finnhub
 * (You can keep this if you still need intraday somewhere else.)
 */
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

/* ------------------------------------------------------------------
   DAILY / RANGE CANDLES FOR LIGHTWEIGHT-CHARTS (Finnhub + caching)
   Endpoint: GET /api/candles/:symbol?resolution=D&range=6M
   Returns:
   {
     symbol, resolution, range, source,
     candles: [
       { time, open, high, low, close, volume },
       ...
     ]
   }
-------------------------------------------------------------------*/

// Simple in-memory cache
// key: `${symbol}_${resolution}_${range}` → { timestamp, data }
const candleCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCacheKey(symbol, resolution, range) {
  return `${symbol}_${resolution}_${range}`;
}

function computeFromTo(range) {
  const nowSec = Math.floor(Date.now() / 1000);
  let days;

  switch (range) {
    case "1D":
      days = 1;
      break;
    case "5D":
      days = 5;
      break;
    case "1M":
      days = 30;
      break;
    case "3M":
      days = 90;
      break;
    case "6M":
      days = 180;
      break;
    case "1Y":
      days = 365;
      break;
    default:
      days = 180; // fallback 6M
  }

  const fromSec = nowSec - days * 24 * 60 * 60;
  return { fromSec, toSec: nowSec };
}

/**
 * GET /api/candles/:symbol
 * Daily candles / range candles for chart (Finnhub)
 */
router.get("/candles/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const resolution = req.query.resolution || "D"; // 1, 5, 15, 30, 60, D, W, M
    const range = req.query.range || "6M";

    if (!API_KEY) {
      return res.status(500).json({
        error: "FINNHUB_API_KEY is not configured on the server.",
      });
    }

    const cacheKey = getCacheKey(symbol, resolution, range);
    const cached = candleCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({
        symbol,
        resolution,
        range,
        source: "cache",
        candles: cached.data,
      });
    }

    const { fromSec, toSec } = computeFromTo(range);

    const url = `${FINN}/stock/candle`;
    const { data } = await axios.get(url, {
      params: {
        symbol,
        resolution,
        from: fromSec,
        to: toSec,
        token: API_KEY,
      },
    });

    if (data.s !== "ok" || !Array.isArray(data.t) || data.t.length === 0) {
      return res.status(404).json({
        error: "No candle data available from Finnhub.",
        details: data,
      });
    }

    // Finnhub returns arrays: t, o, h, l, c, v
    const candles = data.t.map((t, i) => ({
      time: t, // unix seconds – exactly what lightweight-charts wants
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }));

    candleCache.set(cacheKey, {
      timestamp: Date.now(),
      data: candles,
    });

    return res.json({
      symbol,
      resolution,
      range,
      source: "live",
      candles,
    });
  } catch (err) {
    console.error("Candle route error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to fetch candle data.",
      details: err.message,
    });
  }
});

module.exports = router;
