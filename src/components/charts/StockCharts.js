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
import moment from "moment";

const DAYS = 30;           // number of data points
const VOL_MIN = 1000;      // volume range
const VOL_MAX = 5000;
const VOLATILITY = 0.02;   // ±2% daily noise

const StockCharts = () => {
  const { symbol } = useParams();
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchAndBuild = async () => {
      try {
        // 1) fetch real current price
        const { data: quote } = await axios.get(`/api/quote/${symbol}`);
        const realPrice = parseFloat(quote.price);

        // 2) build a simple random walk
        let walk = [1];
        for (let i = 1; i < DAYS; i++) {
          const change = (Math.random() * 2 - 1) * VOLATILITY;
          walk[i] = walk[i - 1] * (1 + change);
        }
        // 3) scale so last value = realPrice
        const scale = realPrice / walk[DAYS - 1];
        const scaled = walk.map((v) => v * scale);

        // 4) assemble OHLCV for each day
        const chart = scaled.map((close, i) => {
          const prev = i === 0 ? close : scaled[i - 1];
          const hi = Math.max(prev, close) * (1 + Math.random() * VOLATILITY);
          const lo = Math.min(prev, close) * (1 - Math.random() * VOLATILITY);
          return {
            date: moment().subtract(DAYS - 1 - i, "days").format("MMM D"),
            open: prev,
            high: hi,
            low: lo,
            close,
            volume:
              Math.floor(Math.random() * (VOL_MAX - VOL_MIN + 1)) + VOL_MIN,
          };
        });

        setData(chart);
        setError("");
      } catch (e) {
        console.error("Failed to build dummy chart:", e);
        setError("Unable to load chart.");
      }
    };

    fetchAndBuild();
  }, [symbol, user]);

  if (!user) {
    return <p style={{ padding: "1rem" }}>🔐 Please log in to view charts.</p>;
  }
  if (error) {
    return <p style={{ padding: "1rem" }}>⚠️ {error}</p>;
  }
  if (data.length === 0) {
    return <p style={{ padding: "1rem" }}>Loading chart...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{symbol} (Dummy) Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
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
          <Bar
            yAxisId="right"
            dataKey="volume"
            barSize={20}
            opacity={0.3}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="close"
            stroke="#82ca9d"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockCharts;
