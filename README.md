# ✈️ Traveloop – Personalized Travel Planning Platform

A full-stack travel planning application with 14 screens, built with **HTML/CSS/JavaScript** frontend and **Node.js + Express + MySQL** backend.

---

## 🚀 Quick Start

### 1. Set up MySQL Database

Open MySQL Workbench or terminal and run:

```sql
source d:/Project/Traveloop/database/schema.sql
```

This creates the `traveloop_db` database with all tables and seed data (15 cities, activities).

### 2. Configure Environment

Edit `backend/.env` if your MySQL credentials differ:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=        ← your password here
DB_NAME=traveloop_db
JWT_SECRET=traveloop_super_secret_jwt_key_2024
PORT=5000
```

### 3. Install & Start Backend

```bash
cd d:\Project\Traveloop\backend
npm install
npm run dev       # development with nodemon
# OR
npm start         # production
```

### 4. Open the App

Navigate to: **http://localhost:5000/**

---

## 🔑 Demo Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@traveloop.com    | Admin@123  |

---

## 📱 14 Screens

| # | Screen | URL |
|---|--------|-----|
| 1 | Login / Signup | `/` |
| 2 | Dashboard | `/dashboard.html` |
| 3 | Create Trip | `/create-trip.html` |
| 4 | My Trips | `/my-trips.html` |
| 5 | Itinerary Builder | `/itinerary-builder.html?id=<tripId>` |
| 6 | Itinerary View | `/itinerary-view.html?id=<tripId>` |
| 7 | City Search | `/city-search.html` |
| 8 | Activity Search | `/activity-search.html` |
| 9 | Budget Tracker | `/budget.html?id=<tripId>` |
| 10 | Packing Checklist | `/packing.html?id=<tripId>` |
| 11 | Shared Itinerary | `/shared-itinerary.html?token=<token>` |
| 12 | Profile / Settings | `/profile.html` |
| 13 | Trip Notes | `/notes.html?id=<tripId>` |
| 14 | Admin Dashboard | `/admin.html` |

---

## 🏗️ Project Structure

```
Traveloop/
├── frontend/          # Static HTML/CSS/JS (14 pages)
│   ├── css/style.css  # Full design system
│   ├── js/api.js      # Fetch API wrapper
│   ├── js/auth.js     # JWT auth helpers
│   ├── js/ui.js       # Sidebar, toast, formatters
│   └── *.html         # 14 screen pages
├── backend/
│   ├── server.js      # Express entry point
│   ├── config/db.js   # MySQL via Sequelize
│   ├── middleware/
│   ├── routes/        # 9 route modules
│   └── package.json
└── database/
    └── schema.sql     # Full schema + seed data
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8 + Sequelize ORM
- **Auth**: JWT + bcryptjs
- **Charts**: Chart.js
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter)
