# CoastGuard

Community-powered disaster management platform for coastal India. Real-time hazard reporting, AI-powered alerts, and social media analytics. Styled with a cohesive White & Blue Ocean Palette.

---

## 📁 Project Structure

```
sih/
├── frontend/          # Vite + React + TypeScript web app
├── backend/           # Node.js + Express REST API
├── app.py             # Python/Streamlit ML app
├── model.py           # ML model definitions
├── Final.ipynb        # ML training notebook
└── ...                # Other ML/data assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB (local or Atlas)
- Python 3.9+ (for ML components)

---

### 🖥️ Frontend

```bash
cd frontend
npm install
cp .env.example .env     # Edit VITE_API_BASE_URL if needed
npm run dev
```

Opens at: **http://localhost:5173**

#### Build for production
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

**Deploy to:** Vercel, Netlify, Cloudflare Pages

---

### ⚙️ Backend

```bash
cd backend
npm install
cp .env.example .env     # Fill in all required secrets
npm start
```

API runs at: **http://localhost:3003**

#### Development (with nodemon auto-reload)
```bash
cd backend
npx nodemon server.js
```

**Deploy to:** Render, Railway, Heroku, AWS EC2

---

### 🤖 ML / Python (Optional)

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
# or: source .venv/bin/activate  (Linux/Mac)

pip install -r requirements.txt   # if present
streamlit run app.py
```

---

## 🌐 Deployment Guide

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend-url.com`
5. Deploy ✅

### Backend → Render
1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add all environment variables from `backend/.env.example`
7. Deploy ✅

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend server URL (without `/api`) | `http://localhost:3003` |

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3003) |
| `MONGODB_URI` | MongoDB connection string |
| `TWILIO_ACCOUNT_SID` | Twilio credentials for voice alerts |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number |
| `GEMINI_API_KEY` | Google Gemini AI key |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_USER` | Email sender address |
| `SMTP_PASS` | Gmail app password |
| `AUTHORITY_EMAILS` | Comma-separated notification emails |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, MongoDB/Mongoose |
| AI/ML | Python, TensorFlow/Keras, Streamlit |
| Maps | Leaflet, Mapbox GL |
| Auth | bcryptjs, JWT |
| Realtime | Socket.IO |
| Notifications | Twilio, Nodemailer |
| AI Chat | Google Gemini |

---

## 🌊 Disaster Relief & Safety Features

- **Live Coastal Weather Advisory Banner (`/weather`)**: Real-time IMD ocean alerts, wind speeds (knots), wave heights, and storm surge warnings across coastal states.
- **Emergency Contact Directory (`/emergency-contacts`)**: 1-click dialer, emergency SMS payload generator, Indian Coast Guard (1554), NDRF (1078), and marine police helplines.
- **Disaster Relief Camp Tracker (`/shelters`)**: Real-time shelter occupancy, food supply status, medical team availability, and Google Maps direction dispatch.
- **Multilingual Audio Warning Broadcast (`/guides` / Floating)**: Text-to-Speech audio siren warnings in 8 regional languages (Tamil, Malayalam, Telugu, Gujarati, Marathi, Bengali, Hindi, English).
- **Fisherman Geofence & Maritime Boundary Overlay (`/map`)**: Distance calculation to International Maritime Boundary Line (IBL) with proximity alerts.
- **Coastal Survival Guides (`/guides`)**: Actionable protocols for Cyclones, Tsunamis, Boat Capsize, Oil Spills, and Storm Surges.
- **Hazard Heatmap Analytics (`/analytics`)**: Temporal trend mapping, regional vulnerability indices, and AI hazard confidence metrics.
- **Community Volunteer Dispatch (`/volunteers`)**: Volunteer registry, skill checklist, and emergency task assignment portal.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/emergency-contacts` | Fetch emergency helplines with region & category filter |
| `POST` | `/api/geofence/check-risk` | Evaluate maritime border distance & safety risk score |
| `GET` | `/api/relief-camps` | Fetch active coastal relief shelters & occupancy statistics |
| `POST` | `/api/relief-camps` | Register new disaster shelter facility |
| `GET` | `/api/weather/advisories` | Fetch IMD coastal meteorological bulletins |
| `GET` | `/api/audio-alerts` | Fetch multilingual voice broadcast audio payloads |
| `GET` | `/api/reports/export/csv` | Download verified disaster reports in CSV format |
