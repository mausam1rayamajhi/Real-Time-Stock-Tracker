// frontend/src/components/stocks/StockCard.js
import React from "react";
import WishlistButton from "../wishlist/WishlistButton";
import "./StockCard.css";

const StockCard = ({ symbol, name, price, percentChange }) => {
  const hasPercent =
    typeof percentChange === "number" && !Number.isNaN(percentChange);
  const isPositive = hasPercent && percentChange > 0;

  return (
    <div
      className="stock-card"
      style={{
        border: "1px solid #333",
        padding: "1rem",
        margin: "1rem",
        borderRadius: "8px",
        background: "#111",
        color: "#eee",
      }}
    >
      <h3>
        {symbol} - {name || symbol}
      </h3>
      <p>💲 {typeof price === "number" ? price : "N/A"}</p>
      <p style={{ color: isPositive ? "lightgreen" : "salmon" }}>
        {hasPercent ? (
          <>
            {isPositive ? "▲" : "▼"} {percentChange.toFixed(2)}%
          </>
        ) : (
          "N/A"
        )}
      </p>

      <WishlistButton symbol={symbol} />
    </div>
  );
};

export default StockCard;
