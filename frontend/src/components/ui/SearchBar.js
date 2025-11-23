import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [symbol, setSymbol] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim() !== '') {
      navigate(`/search/${symbol.trim().toUpperCase()}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol (e.g. AAPL)"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;