// frontend/src/pages/SearchResults.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StockCharts from "../components/charts/StockCharts";
import CompanyInfo from "../components/stocks/CompanyInfo";
import StockCard from "../components/stocks/StockCard";

import "./SearchResults.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://real-time-stock-tracker-backend.onrender.com";

const SearchResults = () => {
  const { symbol } = useParams();
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setError("");
        setPriceData(null);

        console.log("🔍 Fetching quote for", symbol, "from", API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/api/quote/${symbol}`);

        if (!response.ok) {
          console.error(" Quote fetch failed:", response.status);
          setError("Unable to load price data for this symbol.");
          return;
        }

        const data = await response.json();
        console.log(" Quote data:", data);

        const priceNumber = Number(data.price);
        const changeNumber =
          data.percentChange !== undefined
            ? Number(data.percentChange)
            : null;

        if (!Number.isNaN(priceNumber)) {
          setPriceData({
            price: priceNumber,
            percentChange: changeNumber,
          });
        } else {
          setError("Received invalid price data from backend.");
        }
      } catch (err) {
        console.error("🔥 Fetching error:", err);
        setError("Error contacting backend.");
      }
    };

    fetchData();
  }, [symbol]);

  return (
  <div className="search-results">
    <h1 className="search-results-title">Stock Viewer: {symbol}</h1>

    {error && <p className="search-results-error">{error}</p>}

    <div className="search-results-header">
      {priceData ? (
        <StockCard
          symbol={symbol}
          name={symbol}
          price={priceData.price}
          percentChange={priceData.percentChange}
        />
      ) : (
        !error && <p>Loading price data...</p>
      )}

      {/* Company info next to / under the card, but centered */}
      <CompanyInfo symbol={symbol} />
    </div>

    <div className="stock-charts">
      <StockCharts symbol={symbol} />
    </div>
  </div>
);
};

export default SearchResults;