// Bringing in required packages
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const yahooFinance = require('yahoo-finance2').default;

const app = express();

// Grabbing your API key securely from environment variables
const API_KEY = process.env.FINNHUB_API_KEY;
console.log('🔑 Loaded Finnhub API key:', API_KEY ? 'Yes' : 'No');

// Middleware
app.use(cors());
app.use(express.json());

/* QUOTE endpoint (Finnhub) */
app.get('/api/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );
    const percentChange = ((data.c - data.pc) / data.pc) * 100;
    res.json({ price: data.c, percentChange: percentChange.toFixed(2) });
  } catch (err) {
    console.error('Error fetching quote:', err.message);
    res.status(500).json({ error: 'Error fetching quote' });
  }
});

/* PROFILE endpoint (Finnhub) */
app.get('/api/profile/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    res.json(data);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

/* SEARCH endpoint (Finnhub) */
app.get('/api/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`
    );
    res.json(data.result);
  } catch (err) {
    console.error('Error searching:', err.message);
    res.status(500).json({ error: 'Error searching for symbol' });
  }
});

/* STOCK endpoint (Finnhub) */
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );
    const percentChange = ((data.c - data.pc) / data.pc) * 100;
    res.json({ price: data.c, percentChange: percentChange.toFixed(2) });
  } catch (err) {
    console.error('Error fetching stock data:', err.message);
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});

/* CANDLES endpoint (Yahoo Finance) */
app.get('/api/candles/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // last 30 days, daily interval
    const result = await yahooFinance.candles(symbol, {
      period1: '30d',
      interval: '1d'
    });
    const { open, high, low, close, volume, timestamp, status } = result;

    // ensure we got arrays back
    if (!Array.isArray(timestamp) || timestamp.length === 0) {
      return res.status(400).json({ error: 'No candle data available' });
    }

    res.json({
      o: open,
      h: high,
      l: low,
      c: close,
      v: volume,
      t: timestamp,
      s: status || 'ok'
    });
  } catch (err) {
    console.error('Error fetching candle data:', err.message);
    res.status(500).json({ error: 'Unable to fetch candle data.' });
  }
});

/* TEST endpoint */
app.get('/api/test', (req, res) => {
  res.send('✅ Backend is working!');
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API server running on http://0.0.0.0:${PORT}`);
});
