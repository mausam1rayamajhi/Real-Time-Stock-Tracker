// frontend/src/components/charts/StockCharts.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
} from "recharts";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const StockCharts = ({ symbol: propSymbol }) => {
  // You can pass symbol as a prop OR get it from the URL (/stock/:symbol)
  const routeParams = useParams();
  const symbol = propSymbol || routeParams.symbol;

  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !symbol) return;

    const fetchCandles = async () => {
      try {
        setError("");
        setData([]);

        const res = await axios.get(`${API_BASE_URL}/api/candles/${symbol}`);

        const candles = res.data; // { o, h, l, c, v, t, s }

        if (!candles || !Array.isArray(candles.t) || candles.t.length === 0) {
          setError("No candle data available.");
          return;
        }

        const { o, h, l, c, v, t } = candles;

        const chartData = t.map((ts, i) => {
          // ts can be seconds, ms, or ISO string – normalize to JS Date
          let dateMs;
          if (typeof ts === "number") {
            dateMs = ts < 1e12 ? ts * 1000 : ts; // seconds → ms
          } else {
            dateMs = Date.parse(ts);
          }

          const d = new Date(dateMs);
          const label = d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });

          return {
            date: label,
            open: o[i],
            high: h[i],
            low: l[i],
            close: c[i],
            volume: v[i],
          };
        });

        setData(chartData);
      } catch (err) {
        console.error("Error loading candle data:", err);
        setError("Unable to load chart data.");
      }
    };

    fetchCandles();
  }, [symbol, user]);

  if (!user) {
    return <p style={{ padding: "1rem" }}>🔐 Please log in to view charts.</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "1rem", color: "salmon" }}>
        {error}
      </p>
    );
  }

  if (data.length === 0) {
    return <p style={{ padding: "1rem" }}>Loading chart...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{symbol} – Daily Price & Volume (Real Data)</h2>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            orientation="right"
            domain={["auto", "auto"]}
          />
          <YAxis
            yAxisId="right"
            orientation="left"
            hide
            domain={["auto", "auto"]}
          />
          <Tooltip />

          {/* Volume as bars */}
          <Bar
            yAxisId="right"
            dataKey="volume"
            barSize={16}
            opacity={0.35}
          />

          {/* Close price as line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="close"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockCharts;
