// frontend/src/components/charts/StockCharts.js

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://real-time-stock-tracker-backend.onrender.com";

const cardStyle = {
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  padding: "1.5rem",
  margin: "1rem auto",
  width: "100%",
  maxWidth: "900px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255, 255, 255, 0.35)",
  color: "#003366",
};

const StockCharts = ({
  symbol: propSymbol,
  range = "30D",     // just for label, backend always returns 30 days
  resolution = "D",  // just for label
}) => {
  const { user } = useContext(UserContext);
  const routeParams = useParams();
  const symbol = (propSymbol || routeParams.symbol || "").toUpperCase();

  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [chartReady, setChartReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  // 1️⃣ Create chart once in browser (via window.LightweightCharts)
  useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) return; // prevent double init in StrictMode

    const LW = window.LightweightCharts;
    if (!LW || typeof LW.createChart !== "function") {
      console.error("LightweightCharts global not found");
      setError("Chart library failed to load.");
      return;
    }

    const chart = LW.createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: "solid", color: "rgba(0,0,0,0)" },
        textColor: "#003366",
      },
      grid: {
        vertLines: { color: "rgba(0,0,0,0.05)" },
        horzLines: { color: "rgba(0,0,0,0.05)" },
      },
      rightPriceScale: {
        borderColor: "rgba(0,0,0,0.15)",
      },
      timeScale: {
        borderColor: "rgba(0,0,0,0.15)",
      },
      crosshair: {
        mode: 1,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderUpColor: "#16a34a",
      borderDownColor: "#dc2626",
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;
    setChartReady(true);

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      setChartReady(false);
    };
  }, []);

  // 2️⃣ Fetch candles AFTER chart is ready
  useEffect(() => {
    const fetchCandles = async () => {
      if (!symbol || !chartReady || !seriesRef.current || !chartRef.current) {
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSource("");

        const url = `${API_BASE_URL}/api/candles/${symbol}`;
        console.log("📈 Fetching candles:", url);

        const res = await fetch(url);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch candle data.");
        }

        const data = await res.json();

        let candles = data.candles;

        // Fallback if endpoint ever changes to o/h/l/c/v/t arrays
        if (!candles && Array.isArray(data.t)) {
          const { o, h, l, c, v, t } = data;
          candles = t.map((ts, i) => {
            let timeSec;
            if (typeof ts === "number") {
              timeSec = ts < 1e12 ? ts : Math.floor(ts / 1000);
            } else {
              timeSec = Math.floor(new Date(ts).getTime() / 1000);
            }
            return {
              time: timeSec,
              open: o[i],
              high: h[i],
              low: l[i],
              close: c[i],
              volume: v ? v[i] : undefined,
            };
          });
        }

        if (!candles || candles.length === 0) {
          setError("No candle data available.");
          return;
        }

        setSource(data.source || "");
        seriesRef.current.setData(candles);
        chartRef.current.timeScale().fitContent();
      } catch (err) {
        console.error("Error loading candle data:", err);
        setError(err.message || "Unable to load chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandles();
  }, [symbol, chartReady]);

  // Require login (same behavior you had)
  if (!user) {
    return (
      <div style={cardStyle}>
        <p>Please log in to view charts.</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2>
        {symbol || "—"} – 30-Day Candlestick Chart ({resolution})
      </h2>

      {source && (
        <small style={{ opacity: 0.7 }}>
          Source: {source === "yahoo" ? "Yahoo Finance" : source}
        </small>
      )}

      {loading && <p>Loading chart...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default StockCharts;
