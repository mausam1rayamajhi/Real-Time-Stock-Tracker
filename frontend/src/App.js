// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Home page with the watchlist cards */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />


          {/* Stock details + chart page */}
          <Route path="/search/:symbol" element={<SearchResults />} />

          {/* Optional: catch-all for unknown routes */}
          {/* <Route path="*" element={<Home />} /> */}
          {/* <Route path="*" element={<p style={{ padding: '2rem' }}>Page not found</p>} /> */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
