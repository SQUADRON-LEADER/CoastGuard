# Changelog

All notable changes to **CoastGuard** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Push notification via Firebase Cloud Messaging (FCM)
- Offline-first PWA support with Service Workers
- AI-powered damage cost estimation from images
- Integration with INCOIS (Indian National Centre for Ocean Information Services) live API

---

## [1.0.0] — 2024-12-01

### Added
- 🌊 Full-stack CoastGuard platform launched for SIH 2024
- 📡 Real-time hazard reporting with photo/video upload (Multer + MongoDB)
- 🗺️ Interactive dual-engine map (Leaflet + Mapbox GL) with live disaster pins
- 🤖 Google Gemini AI multilingual chatbot (8 Indian languages)
- 🧭 AI-powered evacuation route advisor
- 📞 Twilio automated voice call + SMS alert system for authorities
- 📊 Hazard heatmap analytics with temporal trend visualization (leaflet.heat)
- 🏕️ Real-time relief camp tracker with occupancy and supply status
- 🆘 Emergency contact directory with 1-click dialer (Coast Guard 1554, NDRF 1078)
- 🎙️ Multilingual Text-to-Speech audio siren in 8 regional languages
- 🐟 Fisherman maritime geofence with IMBL proximity alerts
- 📖 Coastal disaster survival guides (Cyclone, Tsunami, Oil Spill, Boat Capsize)
- 👥 3-tier role system: Citizen Reporter → Community Validator → Verifier Protector
- 🏆 Gamified leaderboard with points for verified contributions
- 🤝 Community volunteer dispatch registry with skill-based task assignment
- 📱 WhatsApp floating help button for distress messaging
- 🧠 MobileNetV2 hazard image classifier (TensorFlow/Keras, 87% validation accuracy)
- 📈 Social media disaster sentiment analytics feed
- ✅ 3-step report verification pipeline with EXIF metadata inspector

### Security
- JWT-based authentication with bcryptjs password hashing
- Environment variable management via dotenv (no secrets in repo)
- Role-based access control (RBAC) on all sensitive API endpoints

---

## [0.9.0] — 2024-11-15

### Added
- Verifier Protector dashboard with full report queue management
- Community Validator dashboard with peer-review capabilities
- Export verified disaster reports to CSV

### Fixed
- Map cluster markers not rendering on mobile viewports
- Socket.IO reconnect loop on slow 3G connections

---

## [0.8.0] — 2024-11-01

### Added
- Weather advisory banner with IMD coastal meteorological data
- Hazard severity heatmap with time-slider filter

### Changed
- Migrated map engine from Google Maps to Leaflet + Mapbox GL (cost reduction)
- Switched from Twilio SMS only to combined Voice + SMS alert system

---

## [0.7.0] — 2024-10-15

### Added
- Initial React 18 + TypeScript + Vite project scaffold
- Node.js + Express backend with MongoDB/Mongoose ODM
- Basic JWT authentication flow
- Initial Leaflet map integration

---

[Unreleased]: https://github.com/SQUADRON-LEADER/CoastGuard/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SQUADRON-LEADER/CoastGuard/releases/tag/v1.0.0
[0.9.0]: https://github.com/SQUADRON-LEADER/CoastGuard/releases/tag/v0.9.0
[0.8.0]: https://github.com/SQUADRON-LEADER/CoastGuard/releases/tag/v0.8.0
[0.7.0]: https://github.com/SQUADRON-LEADER/CoastGuard/releases/tag/v0.7.0
