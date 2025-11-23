// frontend/src/pages/SearchResults.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockCharts from "../components/charts/StockCharts";
import CompanyInfo from "../components/stocks/CompanyInfo";
import StockCard from "../components/stocks/StockCard";
import "./SearchResults.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SearchResults = () => {
  const { symbol } = useParams();
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setPriceData(null);

        const res = await fetch(`${API_BASE_URL}/api/quote/${symbol}`);

        if (!res.ok) {
          console.error("Quote fetch failed with status:", res.status);
          setError("Unable to load price data for this symbol.");
          return;
        }

        const data = await res.json();

        if (data && typeof data.price === "number" && !isNaN(data.price)) {
          setPriceData({
            price: data.price,
            percentChange: data.percentChange,
          });
        } else {
          setError("Received invalid price data.");
        }
      } catch (err) {
        console.error("Fetching error:", err);
        setError("Error contacting backend.");
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div className="search-results">
      <h1 style={{ color: "#90caf9" }}>Stock Viewer: {symbol}</h1>

      {error && <p style={{ color: "salmon" }}>{error}</p>}

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

      <CompanyInfo symbol={symbol} />

      <div className="stock-charts">
        <StockCharts symbol={symbol} />
      </div>
    </div>
  );
};

export default SearchResults;
