// frontend/src/pages/Home.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import SearchBar from "../components/ui/SearchBar";
import WishlistView from "../components/wishlist/WishlistView";
import StockCard from "../components/stocks/StockCard";
import Login from "../components/auth/Login";
import { UserContext } from "../UserContext";

import "./Home.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://real-time-stock-tracker-backend.onrender.com";

const symbolsToFetch = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"];

const Home = () => {
  const { user } = useContext(UserContext);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const promises = symbolsToFetch.map(async (symbol) => {
          try {
            const res = await axios.get(`${API_BASE_URL}/api/quote/${symbol}`);
            return {
              symbol,
              name: symbol,
              price: res.data.price,
              percentChange: res.data.percentChange,
            };
          } catch (err) {
            console.error(`Error fetching data for ${symbol}`, err);
            return null;
          }
        });

        const results = await Promise.all(promises);
        setStockData(results.filter(Boolean));
      } catch (err) {
        console.error("Error fetching top stocks:", err);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div className="home-page">
      {/* Header */}
      <h1 className="home-title">Real-Time Stock Tracker</h1>
      <p className="home-subtitle">
        View live prices, explore charts, and manage your personal watchlist.
      </p>

      {/* Search */}
      <div className="home-search-wrapper">
        <SearchBar />
      </div>

      {/* Main content card: left = featured stocks, right = wishlist */}
      <section className="home-main-card">
        <div className="home-stocks-column">
          <h2 className="home-card-title">Featured Stocks</h2>
          <p className="home-card-caption">
            Some popular symbols to get you started.
          </p>
          <div className="home-stocks-grid">
            {stockData.map((stock) => (
              <StockCard
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                price={stock.price}
                percentChange={stock.percentChange}
              />
            ))}
            {stockData.length === 0 && (
              <p style={{ marginTop: "0.5rem" }}>Loading featured stocks...</p>
            )}
          </div>
        </div>

        <div className="home-watchlist-column">
          <h2 className="home-card-title">Your Watchlist</h2>
          {user ? (
            <WishlistView />
          ) : (
            <div className="home-watchlist-locked">
              <p style={{ marginBottom: "0.75rem" }}>
                Log in to build and view your watchlist.
              </p>
              <Login />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;