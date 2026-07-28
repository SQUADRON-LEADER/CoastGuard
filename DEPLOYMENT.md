# CoastGuard Deployment Guide

This guide explains how to deploy the **CoastGuard Backend API** on [Render](https://render.com) and connect your **Frontend application**.

---

## 🚀 Step 1: Deploy Backend to Render

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → select **Web Service**.
3. Connect your GitHub repository (`SIH` / `CoastGuard`).
4. Configure the Web Service settings:
   - **Name**: `coastguard-backend` (or any custom name)
   - **Region**: Select your closest region (e.g., Singapore / Frankfurt)
   - **Root Directory**: `backend` *(⚠️ Crucial! Required because server files reside in the `backend/` subfolder)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node server.js`)
   - **Plan**: `Free` (or desired paid tier)
   - **Health Check Path**: `/health`

5. Add Environment Variables in Render:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/coastguard?retryWrites=true&w=majority` *(MongoDB Atlas Cloud URI)*
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key
   - `SMTP_USER` & `SMTP_PASS`: *(Optional)* Gmail App Password for alert emails
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: *(Optional)* Twilio credentials for voice SOS calls

6. Click **Create Web Service**. Once deployed, Render will provide a live URL like:
   `https://coastguard-backend.onrender.com`

---

## 🌐 Step 2: Connect Frontend to Render Backend

1. When deploying your frontend (to Vercel, Netlify, Render, or GitHub Pages), set the environment variable:
   ```env
   VITE_API_BASE_URL=https://coastguard-backend.onrender.com
   ```
2. If running locally against your deployed Render backend:
   Update `frontend/.env`:
   ```env
   VITE_API_BASE_URL=https://coastguard-backend.onrender.com
   ```
3. Rebuild and run the frontend:
   ```bash
   cd frontend
   npm run build
   ```

---

## 🩺 Verification & Testing

- **Backend Health Check**:
  Open `https://coastguard-backend.onrender.com/health` in your browser. It should return:
  ```json
  { "status": "OK", "uptime": 12.34 }
  ```
- **API Response Check**:
  Open `https://coastguard-backend.onrender.com/api/emergency-contacts` to verify API endpoint responses.
