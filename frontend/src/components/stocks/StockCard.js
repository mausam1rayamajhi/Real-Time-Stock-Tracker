// frontend/src/components/stocks/StockCard.js
import React from "react";
import WishlistButton from "../wishlist/WishlistButton";
import "./StockCard.css";

const StockCard = ({ symbol, name, price, percentChange }) => {
  const hasSymbol =
    typeof symbol === "string" && symbol.trim().length > 0;

  const hasPrice = typeof price === "number" && !Number.isNaN(price);
  const hasPercent =
    typeof percentChange === "number" && !Number.isNaN(percentChange);

  const isPositive = hasPercent && percentChange > 0;

  return (
    <div
      className="stock-card"
      style={{
        borderRadius: "16px",
        padding: "1.5rem",
        margin: "1rem auto",
        width: "240px",
        maxWidth: "100%",
        background: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
        color: "#0f172a",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "0.75rem", fontWeight: 700 }}>
        {hasSymbol ? symbol.toUpperCase() : "—"}{" "}
        {name && name !== symbol ? `– ${name}` : ""}
      </h3>

      <p
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          marginBottom: "0.25rem",
        }}
      >
        {hasPrice ? `$${price.toFixed(2)}` : "Price N/A"}
      </p>

      <p
        style={{
          fontWeight: 600,
          marginBottom: "0.75rem",
          color: hasPercent
            ? isPositive
              ? "#16a34a" // green
              : "#dc2626" // red
            : "#6b7280", // gray
        }}
      >
        {hasPercent
          ? `${isPositive ? "▲" : "▼"} ${percentChange.toFixed(2)}%`
          : "Change N/A"}
      </p>

      {/* Only render WishlistButton if we have a valid symbol */}
      {hasSymbol && (
        <WishlistButton symbol={symbol.toUpperCase()} />
      )}
    </div>
  );
};

export default StockCard;
