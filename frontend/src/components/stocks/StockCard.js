import React, { useContext } from "react";
import { UserContext } from "../../UserContext";

const StockCard = ({ symbol, name, price, percentChange, onRemove }) => {
  const { user } = useContext(UserContext);

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "1.5rem",
    margin: "1rem auto",
    width: "240px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    color: "#003366",
  };

  return (
    <div style={cardStyle}>
      <h3>{symbol} - {name}</h3>

      <p style={{ fontSize: "1.4rem", fontWeight: "bold" }}>${price}</p>

      <p style={{
        color: percentChange >= 0 ? "#00b869" : "#d9534f",
        fontWeight: 600
      }}>
        {percentChange >= 0 ? "▲" : "▼"} {percentChange}%
      </p>

      {user && (
        <button
          onClick={onRemove}
          style={{
            marginTop: "0.75rem",
            padding: "0.4rem 1rem",
            border: "none",
            borderRadius: "10px",
            background: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          Remove from Wishlist
        </button>
      )}
    </div>
  );
};

export default StockCard;
