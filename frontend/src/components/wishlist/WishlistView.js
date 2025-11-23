// frontend/src/components/wishlist/WishlistView.js
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://real-time-stock-tracker-backend.onrender.com";

const WishlistView = () => {
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);
  const [stockDetails, setStockDetails] = useState({});

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setWishlist(snap.data().wishlist || []);
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchDetails = async () => {
      const results = {};

      await Promise.all(
        wishlist.map(async (symbol) => {
          try {
            const [stockRes, profileRes] = await Promise.all([
              axios.get(`${API_BASE_URL}/api/quote/${symbol}`),
              axios.get(`${API_BASE_URL}/api/profile/${symbol}`),
            ]);

            results[symbol] = {
              name: profileRes.data.name || symbol,
              price: stockRes.data.price,
              percentChange: stockRes.data.percentChange,
            };
          } catch (err) {
            console.error(`Error fetching details for ${symbol}`, err);
          }
        })
      );

      setStockDetails(results);
    };

    if (wishlist.length > 0) {
      fetchDetails();
    } else {
      setStockDetails({});
    }
  }, [wishlist]);

  return (
    <div
      style={{
        padding: "1rem",
        background: "#f9fafb",
        color: "#0f172a",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
      }}
    >
      {wishlist.length === 0 ? (
        <p style={{ margin: 0 }}>No stocks in watchlist yet.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
          {wishlist.map((symbol) => {
            const data = stockDetails[symbol];

            const price = data ? Number(data.price) : NaN;
            const change = data ? Number(data.percentChange) : NaN;

            const hasPrice = !Number.isNaN(price);
            const hasChange = !Number.isNaN(change);
            const isPositive = hasChange && change >= 0;

            return (
              <li
                key={symbol}
                style={{
                  marginBottom: "0.75rem",
                  fontSize: "0.95rem",
                }}
              >
                <strong>{data?.name || symbol}</strong>{" "}
                {data ? (
                  <>
                    {hasPrice && <>— ${price.toFixed(2)} </>}
                    {hasChange && (
                      <span
                        style={{
                          color: isPositive ? "#16a34a" : "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        {isPositive ? "▲" : "▼"} {change.toFixed(2)}%
                      </span>
                    )}
                    {!hasPrice && !hasChange && (
                      <span>Data unavailable</span>
                    )}
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WishlistView;
