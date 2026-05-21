# 🛒 KiranaKart 
> A Premium, Real-Time Quick-Commerce Grocery Platform built with Vite, React, Node.js, and Express.

KiranaKart is a state-of-the-art quick-commerce grocery solution styled after leading platforms like Blinkit, Zepto, and Instamart. It features real-time shopping cart logic, smart target progress bars, flexible seller configuration dashboards, and advanced OTP-based mobile authentication.

---

## 🌟 Premium Features

### 1. ⚙️ Seller-Controlled Store Settings Dashboard
* **Dynamic Fee Management**: Sellers can manually toggle delivery and surge charges ON or OFF in real time.
* **Manual Free Delivery Thresholds**: Sellers can activate a minimum order value (e.g., ₹199) to qualify for free shipping, with handy preset buttons (`₹99`, `₹149`, `₹199`, `₹299`, `₹499`).
* **Live Customer Simulation**: Real-time visual comparison showing how active thresholds adjust bill summaries instantly.

### 2. 📲 Frictionless Mobile OTP Login & Auto-Signups
* **Auto-Advancing Verification Boxes**: Polished 4-digit numeric verification inputs that dynamically jump focus as the user types and backspaces.
* **Resend SMS Protection**: Visual 60-second countdown timer to secure API resources against spam.

### 3. 🎯 Customer Cart & Smart Goal Trackers
* **AOV Booster Tracker**: Displays a responsive progress bar under the shopping cart showing how close the customer is to unlocking free delivery (*"Add ₹49 more for FREE Delivery"*).
* **Grand Total Waived Indicators**: Automatically waives delivery fees, showing standard fees crossed out and replaced with a bright green **`FREE`** badge.

### 4. 📦 Complete Consumer Experience
* **Order Tracking & Progression**: Real-time progress updates for orders (Placed, Packing, Out for Delivery, Delivered).
* **Address Manager**: Custom dashboard to store, modify, and manage multiple delivery locations.
* **Responsive Layouts**: Gorgeous, modern typography, glassmorphism UI elements, and fast layouts built using TailwindCSS and CSS custom tokens.

---

## 🛠️ Technology Stack
* **Frontend**: React 18, Vite, TailwindCSS, Axios, React Hot Toast
* **Backend**: Node.js, Express, JSONWebToken, Cookie Parser
* **Database**: MongoDB (Atlas) & Mongoose ODM
* **SMS Gateways**: Fast2SMS API & Twilio API (Native Node Fetch)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18 or higher) and [MongoDB](https://www.mongodb.com) installed.

### 2. Installation
Clone the repository and install dependencies for both the frontend client and the backend server:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Environment Configurations

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory and add your credentials:
```env
JWT_SECRET = "your_jwt_secret_text"
NODE_ENV = "development"

# MongoDB Connection
MONGODB_URI = "mongodb+srv://<username>:<password>@cluster.mongodb.net/kiranakart"

# Seller Login (Seller Portal)
SELLER_EMAIL = "seller@kiranakart.com"
SELLER_PASSWORD = "your_secure_password"

```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_CURRENCY="₹"
VITE_BACKEND_URL="http://localhost:4000"
```

### 4. Running the Application

Start the backend server:
```bash
cd server
npm run server
```

Start the frontend Vite dev server:
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to experience KiranaKart!

---

## 📂 Project Architecture
```text
kiranakart/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Modules (Login, Navbar, etc.)
│   │   ├── context/        # Global State Management (AppContext)
│   │   ├── pages/          # Layout Pages (Cart, MyOrders, Seller Settings)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── server/                 # Express Backend API
    ├── controllers/        # Route Handlers (user, order, storeSettings)
    ├── models/             # Mongoose DB Schemas (User, StoreSettings)
    ├── routes/             # API Router Declarations
    ├── server.js           # Server Initialization
    └── package.json
```

---

## 🛡️ License
Distributed under the ISC License. See `LICENSE` for more information.
