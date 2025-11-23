import React from 'react';
import WishlistButton from '../wishlist/WishlistButton';
import './StockCard.css'; // Optional: if you want to style it further

const StockCard = ({ symbol, name, price, percentChange }) => {
  return (
    <div className="stock-card" style={{ border: '1px solid #333', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
      <h3>{symbol} - {name}</h3>
      <p>💲 {price}</p>
      <p style={{ color: percentChange > 0 ? 'green' : 'red' }}>
        {percentChange > 0 ? '▲' : '▼'} {percentChange}%
      </p>
      
      {/* Wishlist Button */}
      <WishlistButton symbol={symbol} />
    </div>
  );
};

export default StockCard;
