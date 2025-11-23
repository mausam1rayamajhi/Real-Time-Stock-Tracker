// frontend/src/components/ui/SearchBar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css"; // optional – only if you create this file

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return;

    // Navigate to the SearchResults page, which will load data for this symbol
    navigate(`/search/${trimmed}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by symbol (e.g., AAPL, NVDA)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
