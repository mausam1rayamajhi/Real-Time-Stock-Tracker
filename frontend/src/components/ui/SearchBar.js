// frontend/src/components/ui/SearchBar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const symbol = trimmed.toUpperCase();
    navigate(`/stock/${symbol}`);
  };

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Search by ticker (e.g., AAPL)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
