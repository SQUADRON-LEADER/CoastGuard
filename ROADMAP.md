# CoastGuard Roadmap 🗺️

This document outlines the planned features, improvements, and long-term vision for CoastGuard. Priorities may shift based on community feedback and disaster management needs.

---

## ✅ v1.0.0 — Current Release (Completed)

> SIH 2024 submission — Full-stack coastal disaster management platform

- [x] Real-time hazard reporting (photo/video + GPS metadata)
- [x] Google Gemini AI multilingual chatbot (8 Indian languages)
- [x] AI-powered evacuation route advisor
- [x] Twilio automated voice call + SMS alerts to authorities
- [x] Dual-engine interactive map (Leaflet + Mapbox GL)
- [x] Fisherman maritime geofence with IMBL proximity alerts
- [x] Hazard heatmap analytics with temporal trend visualization
- [x] Relief camp tracker with real-time occupancy and supply status
- [x] Emergency contact directory (1554, 1078, marine police)
- [x] Multilingual Text-to-Speech audio siren (8 languages)
- [x] Coastal disaster survival guides
- [x] 3-tier role system (Citizen → Validator → Verifier Protector)
- [x] Gamified leaderboard for community contributors
- [x] MobileNetV2 hazard image classifier (87% validation accuracy)
- [x] Social media disaster sentiment analytics
- [x] 3-step report verification pipeline with EXIF inspector
- [x] Community volunteer dispatch registry

---

## 🚧 v1.1.0 — Security & Stability (Q1 2025)

> Hardening the platform for production-grade reliability

- [ ] **Rate limiting** on all API endpoints (express-rate-limit)
- [ ] **Helmet.js** security headers on the Express server
- [ ] **Input sanitization** with express-validator on all POST/PUT routes
- [ ] **Refresh token** rotation (JWT expiry handling on frontend)
- [ ] **File upload scanning** — MIME type + size validation with Multer
- [ ] **Morgan** HTTP request logging for the backend
- [ ] **PM2** process manager configuration for production deployment
- [ ] Backend unit test suite (Jest + Supertest)
- [ ] Frontend component test coverage (Vitest + React Testing Library)

---

## 🔜 v1.2.0 — Enhanced Maps & Real-Time (Q2 2025)

> Deeper maritime intelligence and live situational awareness

- [ ] **WebSocket-driven live map** — disaster pins update in real-time via Socket.IO without page refresh
- [ ] **Cyclone track overlay** — animated storm path projection from IMD data
- [ ] **Tide prediction layer** — 7-day tide height forecast for 50+ coastal stations
- [ ] **Vessel AIS tracking** — live ship position data integration (MarineTraffic API)
- [ ] **Satellite imagery overlay** — ISRO/NASA FIRMS fire and flood detection tiles
- [ ] **3D tsunami wave simulation** — Mapbox GL 3D terrain with wave propagation model
- [ ] **Offline map tiles** — Service Worker caching for areas with poor connectivity

---

## 🔜 v1.3.0 — AI Upgrades (Q3 2025)

> Smarter, faster, and more accurate AI-driven disaster response

- [ ] **Automated severity scoring** — Gemini AI analyzes report text + image to assign 1–10 severity score without human review
- [ ] **Multi-modal hazard detection** — classify uploaded videos (not just images) using frame sampling
- [ ] **Predictive alert system** — combine weather API + historical heatmap data to generate pre-emptive warnings
- [ ] **Named Entity Recognition (NER)** — extract location, person names, and hazard types from report text
- [ ] **AI damage cost estimator** — estimate economic impact from submitted photos
- [ ] **Voice-to-report** — record a voice message; AI transcribes and auto-fills the hazard report form
- [ ] **Chatbot fine-tuning** — dataset expansion with NDRF, IMD, and Indian Coast Guard official guidance documents

---

## 🔜 v1.4.0 — PWA & Mobile (Q4 2025)

> Mobile-first improvements for fishermen with limited connectivity

- [ ] **Progressive Web App (PWA)** — installable on Android/iOS home screen
- [ ] **Offline-first reports** — queue hazard reports locally (IndexedDB) when offline; sync on reconnect
- [ ] **Push notifications** — Firebase Cloud Messaging (FCM) for critical alerts even when app is closed
- [ ] **Background geolocation** — periodic maritime boundary check in the background
- [ ] **Compressed image upload** — automatic client-side image compression before upload (canvas API)
- [ ] **WhatsApp Business API** — two-way WhatsApp integration for report submission and alert receipt
- [ ] **Native Android APK** — Capacitor.js wrapper for Google Play Store distribution

---

## 🔮 v2.0.0 — Platform Expansion (2026)

> Expanding beyond coastal India to all disaster-prone regions

- [ ] **Pan-India deployment** — extend beyond coasts to flood plains, earthquake zones, and wildfire corridors
- [ ] **INCOIS API integration** — real-time Indian National Centre for Ocean Information Services data feed
- [ ] **NDRF command dashboard** — dedicated war-room dashboard for National Disaster Response Force officers
- [ ] **Federated data model** — state-wise data partitioning with cross-state incident correlation
- [ ] **Drone footage integration** — accept live drone stream URLs; AI processes frames for damage assessment
- [ ] **Blockchain audit trail** — immutable log of all report verifications for accountability and legal records
- [ ] **Multi-tenant architecture** — white-label the platform for individual state disaster management authorities
- [ ] **UN Sendai Framework alignment** — reporting dashboards aligned with international disaster risk reduction metrics

---

## 💬 Community Input

Have a feature idea not on this roadmap? We'd love to hear it!

👉 [Open a Feature Request](https://github.com/SQUADRON-LEADER/CoastGuard/issues/new?template=feature_request.md)

---

*Last updated: December 2024 | Version: 1.0.0*
