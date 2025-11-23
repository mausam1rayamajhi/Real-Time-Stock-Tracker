import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const WishlistView = () => {
  const { user } = useContext(UserContext);
  const [wishlist, setWishlist] = useState([]);
  const [stockDetails, setStockDetails] = useState({});

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, 'users', user.uid);

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
              axios.get(`${API_BASE_URL}/api/profile/${symbol}`)
            ]);

            results[symbol] = {
              name: profileRes.data.name || symbol,
              price: stockRes.data.price,
              percentChange: stockRes.data.percentChange
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
    <div style={{ padding: '1rem', background: '#1e3a8a', color: 'white', borderRadius: '8px' }}>
      <h2>Your Watchlist</h2>
      {wishlist.length === 0 ? (
        <p>No stocks in watchlist.</p>
      ) : (
        <ul>
          {wishlist.map((symbol) => {
            const data = stockDetails[symbol];

            // Safely coerce to numbers
            const price = data ? Number(data.price) : NaN;
            const change = data ? Number(data.percentChange) : NaN;

            const hasPrice = !Number.isNaN(price);
            const hasChange = !Number.isNaN(change);
            const isPositive = hasChange && change >= 0;

            return (
              <li key={symbol} style={{ marginBottom: '1rem' }}>
                <strong>{data?.name || symbol}</strong>{' '}
                {data ? (
                  <>
                    {hasPrice && (
                      <>
                        — ${price.toFixed(2)}{' '}
                      </>
                    )}
                    {hasChange && (
                      <span style={{ color: isPositive ? 'lightgreen' : 'salmon' }}>
                        {isPositive ? '▲' : '▼'} {change.toFixed(2)}%
                      </span>
                    )}
                    {!hasPrice && !hasChange && <span>Data unavailable</span>}
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
