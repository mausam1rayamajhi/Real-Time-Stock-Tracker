# Real-Time Stock Tracker

This repository contains the **Real-Time Stock Tracker** — a full-stack app (React frontend + Node/Express backend) with Firebase authentication and charting components.  
It was developed as a final project and includes frontend source, backend route handlers, and a presentation file.

---

## 🚀 Quick Start (Local)

### 1. Run the Frontend
```bash
cd src
npm install
npm start
```
### Run the backend
```bash
cd ..
npm install
node index.js
```
### Visit the Deployed Demo

To view the running site hosted for demo purposes, open your browser and go to:
 http://172.237.147.235

### Project Structure
```bash
stockrealtime/
├── index.js                     # Express backend server
├── package.json                 # Project dependencies
├── package_backend.json         # Backend-specific config
├── routes/
│   └── stockRoutes.js           # API routes for stock data
├── src/
│   ├── App.js                   # Main React app
│   ├── App.css
│   ├── firebase.js              # Firebase authentication
│   ├── components/
│   │   ├── ui/                  # Navbar, SearchBar
│   │   ├── auth/                # Login, UserMenu
│   │   ├── charts/              # StockCharts.js
│   │   ├── stocks/              # StockCard, CompanyInfo
│   │   └── wishlist/            # WishlistView, WishlistButton
│   ├── pages/
│   │   ├── Home.js
│   │   └── SearchResults.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
└── Stock_Tracker_Presentation_final.pptx

```

### Key Features 
🔎 Search and view real-time stock data
📈 Interactive charts with live updates
🔐 Firebase authentication
❤️ Wishlist feature for tracking favorite stocks
🌐 RESTful API via Express.js backend
🎨 Clean UI built with React components and CSS modules

### Tech Stack
| Layer               | Technologies                        |
| ------------------- | ----------------------------------- |
| **Frontend**        | React.js, CSS, Chart.js             |
| **Backend**         | Node.js, Express.js                 |
| **Database / Auth** | Firebase                            |
| **Hosting (demo)**  | Custom server (IP: 172.237.147.235) |


### Installation Notes
Requires Node.js v16+
Replace Firebase config in src/firebase.js with your own credentials if self-hosting
Use .env for API keys (add .env to .gitignore)

### Developer
Mausam Rayamajhi
🎓 Computer Science Student, St. Cloud State University
🔗 www.linkedin.com/in/mausam-rayamajhi
📧 rayamajhimausam@gmail.com


