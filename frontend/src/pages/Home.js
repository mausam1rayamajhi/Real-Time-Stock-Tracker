import React, { useContext, useEffect, useState } from 'react';
import SearchBar from '../components/ui/SearchBar';
import WishlistView from '../components/wishlist/WishlistView';
import StockCard from '../components/stocks/StockCard';
import Login from '../components/auth/Login';
import { UserContext } from '../UserContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const symbolsToFetch = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];

const Home = () => {
  const { user } = useContext(UserContext);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      const promises = symbolsToFetch.map(async (symbol) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/quote/${symbol}`
          );
          return {
            symbol,
            name: symbol,
            price: response.data.price,
            percentChange: response.data.percentChange,
          };
        } catch (err) {
          console.error(`Error fetching data for ${symbol}`, err);
          return null;
        }
      });

      const results = await Promise.all(promises);
      setStockData(results.filter(Boolean));
    };

    fetchStockData();
  }, []);

  return (
    <div style={{ display: 'flex', padding: '2rem' }}>
      {/* Left - Stock cards */}
      <div style={{ flex: 3, marginRight: '2rem' }}>
        <h1>Stock Viewer</h1>
        {!user && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Please log in to add stocks to your wishlist.</p>
            <Login />
          </div>
        )}
        <SearchBar />
        <div>
          {stockData.map(stock => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              percentChange={stock.percentChange}
            />
          ))}
        </div>
      </div>

      {/* Right - Wishlist or placeholder */}
      <div style={{ flex: 1 }}>
        {user ? (
          <WishlistView />
        ) : (
          <div
            style={{
              background: '#1e3a8a',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            🔒 Log in to see your wishlist here.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
