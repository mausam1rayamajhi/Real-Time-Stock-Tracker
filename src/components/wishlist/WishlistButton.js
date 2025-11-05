import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { db } from '../../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'firebase/firestore';

const WishlistButton = ({ symbol }) => {
  const { user } = useContext(UserContext);
  const [inWishlist, setInWishlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setInWishlist(snap.data().wishlist?.includes(symbol));
      }
    };
    checkWishlist();
  }, [user, symbol]);

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = 9999;
    toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const toggleWishlist = async () => {
    if (!user) {
      showToast('🔒 Please sign in to use wishlist. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) await setDoc(ref, { wishlist: [] });

    await updateDoc(ref, {
      wishlist: inWishlist ? arrayRemove(symbol) : arrayUnion(symbol),
    });

    setInWishlist(!inWishlist);
  };

  return (
    <button onClick={toggleWishlist} style={{ marginTop: '0.5rem' }}>
      {inWishlist ? '★ Remove from Wishlist' : '☆ Add to Wishlist'}
    </button>
  );
};

export default WishlistButton;
