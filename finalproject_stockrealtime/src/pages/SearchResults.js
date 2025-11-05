import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StockCharts from '../components/charts/StockCharts'; // Custom charts
import CompanyInfo from '../components/stocks/CompanyInfo';
import StockCard from '../components/stocks/StockCard';
import './SearchResults.css';

const SearchResults = () => {
  const { symbol } = useParams();
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/stock/${symbol}`);
        const data = await res.json();
        if (data && typeof data.price === 'number' && !isNaN(data.price)) {
          setPriceData({
            price: data.price,
            percentChange: data.percentChange
          });
        }
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div className="search-results">
      <h1 style={{ color: '#90caf9' }}>Stock Viewer: {symbol}</h1>
      {priceData ? (
        <StockCard
          symbol={symbol}
          price={priceData.price}
          percentChange={priceData.percentChange}
        />
      ) : (
        <p>Loading price data...</p>
      )}
      <CompanyInfo symbol={symbol} />

      {/* ✅ Wrapped charts with styling */}
      <div className="stock-charts">
        <StockCharts symbol={symbol} />
      </div>
    </div>
  );
};

export default SearchResults;
