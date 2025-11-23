import { useContext } from 'react';
import { auth, db } from './firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';

import Login from './components/auth/Login';
import UserMenu from './components/auth/UserMenu';
import WishlistView from './components/wishlist/WishlistView';
import Navbar from './components/ui/Navbar';

// Making auth/db available in browser console for debugging
window.auth = auth;
window.db = db;

function AppContent() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Navbar />
      <UserMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search/:symbol" element={<SearchResults />} />
        {/* ✅ Protected Route */}
        <Route path="/wishlist" element={user ? <WishlistView /> : <Login />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
