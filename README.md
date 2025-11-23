Live Demo
Frontend (Vercel):
    https://real-time-stock-tracker-puce.vercel.app
Backend (Render):
    https://real-time-stock-tracker-backend.onrender.com

Features
    Stock Search and Quote Data:
    Users can search for any stock symbol and instantly view current price, percent change, and company information using the backend’s market data endpoints.

Candlestick Charts:
    Interactive charts display daily open, high, low, close, and volume data. Charts are generated using Recharts and normalized from Finnhub/Yahoo Finance sources.

Watchlist with Persistent Storage:
    Authenticated users can add or remove stocks from their watchlist.
    The watchlist syncs with Firebase Firestore in real time and each item shows current price and percent change.

User Authentication:
    Email/password login powered by Firebase Authentication.
    Secure routing and protected components ensure only authenticated users can save watchlists or view certain pages.

Full-Stack Deployment:
    Backend hosted on Render with environment-based configuration.
    Frontend hosted on Vercel with Create React App.
    Environment variables are configured for both dev and production.

Technology Stack
Frontend
    React (Create React App)
    React Router
    Axios
    Recharts for charting
    Firebase Authentication
    Firebase Firestore (user profiles and watchlists)
    Vercel hosting
Backend
    Node.js
    Express
    Axios and market data APIs (Finnhub, Yahoo Finance v3)
    CORS configuration for Vercel
    Environment-based config
    Render hosting

Project Structure
Real-Time-Stock-Tracker/
│
├── backend/
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── package.json
│   └── ...
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── firebase.js
    │   ├── UserContext.js
    │   ├── App.js
    │   └── ...
    ├── package.json
    ├── .env
    └── public/


Environment variables 

frontend (varcel)
REACT_APP_API_BASE_URL=https://real-time-stock-tracker-backend.onrender.com
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=

Backend (render)

FINNHUB_API_KEY=
PORT=10000 (Render auto-assigns)

Running locally
Backend
    cd backend
    npm install
    npm start

Runs at http://localhost:5050

Frontend 
    create .env
    REACT_APP_API_BASE_URL=http://localhost:5050

then 
    cd frontend
    npm install
    npm start

API Endpoints (Backend)
Quotes
    GET /api/quote/:symbol
    Returns current price and percent change.

Profile
    GET /api/profile/:symbol
    Returns company metadata.

Candles
    GET /api/candles/:symbol
    Returns O/H/L/C/V arrays and timestamps for charting.

Deployment Notes
Vercel
    Framework: Create React App
    Root Directory: frontend
    Build Command: npm run build
    Output Directory: build
    Environment Variables set in Vercel Dashboard

Render
    Web service
    Root Directory: backend
    Start Command: npm start
    Environment Variables configured in Render Dashboard
    CORS must allow the Vercel domain

Future Improvements
    WebSocket live price updates
    Search autosuggest with fuzzy matching
    More chart indicators (RSI, SMA, EMA)
    Light/Dark theme toggle
    Notification system for price alerts
    Portfolio tracking

License
    MIT License. Free to use, modify, and extend.

