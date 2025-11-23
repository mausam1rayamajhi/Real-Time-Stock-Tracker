// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Login from "./components/auth/Login";
import { UserProvider } from "./UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        {/* Optional padding so content isn't jammed against edges / navbar */}
        <main style={{ padding: "1rem" }}>
          <Routes>
            {/* Home page with the watchlist cards */}
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Stock details + chart page */}
            <Route path="/search/:symbol" element={<SearchResults />} />

            {/* Optional catch-all */}
            {/* <Route path="*" element={<Home />} /> */}
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
}

export default App;
