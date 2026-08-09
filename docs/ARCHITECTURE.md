# CoastGuard — Architecture Documentation

## Overview

CoastGuard is a **three-tier web application** built for real-time coastal disaster management. This document provides a detailed architectural overview of all system components, data flows, and design decisions.

---

## System Architecture Diagram

```
                    ┌───────────────────────────────────────────────────────────┐
                    │                    USERS / CLIENTS                        │
                    │  Citizens · Fishermen · Coast Guard · NDRF · Validators   │
                    └──────────────────────────┬────────────────────────────────┘
                                               │ HTTPS / WSS
                    ┌──────────────────────────▼────────────────────────────────┐
                    │                    PRESENTATION LAYER                      │
                    │         React 18 + TypeScript + Vite (Vercel CDN)         │
                    │                                                            │
                    │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │
                    │  │   Leaflet   │  │  Mapbox GL   │  │  Framer Motion   │ │
                    │  │ (Heatmaps)  │  │  (3D Maps)   │  │  (Animations)    │ │
                    │  └─────────────┘  └──────────────┘  └──────────────────┘ │
                    │                                                            │
                    │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │
                    │  │  Recharts   │  │  Socket.IO   │  │    i18next       │ │
                    │  │  (Charts)   │  │  (Realtime)  │  │  (8 Languages)   │ │
                    │  └─────────────┘  └──────────────┘  └──────────────────┘ │
                    └──────────────────────────┬────────────────────────────────┘
                                               │ REST API + WebSockets
                    ┌──────────────────────────▼────────────────────────────────┐
                    │                    APPLICATION LAYER                       │
                    │       Node.js + Express (Render.com)    Port: 3003        │
                    │                                                            │
                    │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
                    │   │  JWT     │ │  Multer  │ │  CORS    │ │  Socket.IO │ │
                    │   │  Auth    │ │  Upload  │ │  Config  │ │  Server    │ │
                    │   └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
                    └──────────┬─────────────┬──────────────┬───────────────────┘
                               │             │              │
             ┌─────────────────▼──┐  ┌───────▼────────┐  ┌▼──────────────────┐
             │   DATA LAYER       │  │  AI SERVICES   │  │  NOTIFICATION     │
             │                    │  │                │  │  SERVICES         │
             │  MongoDB Atlas     │  │  Google Gemini │  │  Twilio Voice     │
             │  (Primary DB)      │  │  - Chatbot     │  │  Twilio SMS       │
             │                    │  │  - Evacuation  │  │  Nodemailer SMTP  │
             │  Collections:      │  │    Advisor     │  │                   │
             │  - users           │  │                │  │                   │
             │  - reports         │  └────────────────┘  └───────────────────┘
             │  - reliefcamps     │
             │  - emergencyconts  │
             │  - volunteers      │
             │  - notifications   │
             └────────────────────┘

                    ┌─────────────────────────────────────────────────────────┐
                    │                    ML LAYER (Python)                     │
                    │              Standalone — Streamlit Cloud                │
                    │                                                          │
                    │   ┌─────────────────────┐   ┌───────────────────────┐  │
                    │   │   MobileNetV2       │   │   Full ResNet Model   │  │
                    │   │   (11 MB)           │   │   (134 MB)            │  │
                    │   │   Production Model  │   │   Training Reference  │  │
                    │   └─────────────────────┘   └───────────────────────┘  │
                    │                                                          │
                    │   Classes: Cyclone · Flood · Fire · Oil Spill · Damage  │
                    └─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Tree

```
App
├── AuthProvider (Context)
│   └── ReportsProvider (Context)
│       ├── LoadingScreen
│       └── AppRoutes
│           ├── Header (Navigation)
│           ├── [Floating FABs - Authenticated Only]
│           │   ├── WhatsAppHelp
│           │   ├── TwilioDisasterCall
│           │   ├── EvacuationAdvisor
│           │   └── MultilingualChatbot
│           ├── [Route Components]
│           │   ├── LandingPage
│           │   ├── AuthPage
│           │   ├── UserDashboard / VerifierDashboard / CommunityDashboard
│           │   ├── AdvancedUploadForm
│           │   ├── InteractiveMap
│           │   ├── AnalyticsPanel
│           │   ├── SocialMediaFeed
│           │   ├── CommunityFeed
│           │   ├── VerificationPanel
│           │   ├── LeaderboardPanel
│           │   ├── WeatherAdvisoryBanner
│           │   ├── EmergencyContactDirectory
│           │   ├── ReliefCampTracker
│           │   ├── DisasterGuides
│           │   └── VolunteerDispatch
│           └── Footer
```

### State Management

| State | Location | Scope |
|---|---|---|
| Authentication (user, token, isAuthenticated) | `AuthContext` | Global — all components |
| Disaster Reports list | `ReportsContext` | Global — dashboard, map, analytics |
| Chat messages | `MultilingualChatbot` local state | Component-level |
| Map center + zoom | `InteractiveMap` local state | Component-level |
| Toast notifications | `react-hot-toast` (singleton) | Global |

### Data Fetching Pattern

```typescript
// All API calls use the axios service layer in src/services/
// Pattern: async/await with error boundary

const fetchReports = async () => {
  const response = await api.get('/reports', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

---

## Backend Architecture

### Route → Handler → Model Pattern

```
POST /api/reports
  ↓
auth middleware (JWT verify)
  ↓
multer middleware (file upload)
  ↓
report validation
  ↓
Report.create({ ...body, imageUrl, userId })
  ↓
Socket.IO emit('new_report', report)   ← real-time broadcast
  ↓
if severity === 'critical':
  Twilio.calls.create(...)              ← voice alert
  nodemailer.sendMail(...)              ← email alert
  ↓
res.status(201).json(report)
```

### MongoDB Schema Overview

```javascript
// User
{ name, email, passwordHash, role, points, createdAt }

// Report
{ title, description, severity, category, location: {lat, lng},
  imageUrl, userId, status, verifiedBy, createdAt }

// ReliefCamp
{ name, location, capacity, currentOccupancy, foodSupply,
  medicalTeam, contactNumber, coordinates: {lat, lng} }

// EmergencyContact
{ name, number, category, region, available24x7 }

// Volunteer
{ userId, skills, region, available, tasksCompleted }
```

---

## Real-Time Architecture (Socket.IO)

```
Client (Browser)          Server (Express + Socket.IO)
    |                              |
    |--- connect() --------------->|
    |                              |
    |<-- emit('new_report', data)--|  ← when someone submits a report
    |<-- emit('alert', data) ------|  ← when verifier triggers alert
    |<-- emit('camp_update', data)-|  ← when camp occupancy changes
    |                              |
    |--- disconnect() ------------>|
```

---

## AI Integration Architecture

### Google Gemini Chatbot

```
User Message (any of 8 languages)
  ↓
i18next detects language
  ↓
POST /api/chat { message, language, context }
  ↓
Gemini Pro: generateContent([
  systemPrompt (coastal disaster expert, Indian context),
  conversationHistory,
  userMessage
])
  ↓
AI Response streamed back to frontend
```

### Hazard Image Classification

```
User uploads image
  ↓
Multer saves to /uploads/
  ↓
Python Streamlit reads image (PIL)
  ↓
MobileNetV2.predict(preprocessed_image)
  ↓
Softmax probabilities for 5 hazard classes
  ↓
Top prediction + confidence score returned
```

---

## Security Architecture

| Layer | Mechanism |
|---|---|
| **Transport** | HTTPS enforced on Vercel + Render |
| **Authentication** | JWT HS256, 7-day expiry |
| **Password storage** | bcryptjs, salt rounds = 12 |
| **Authorization** | Role-based middleware on all protected routes |
| **Secrets** | Environment variables (never in code) |
| **File uploads** | MIME type validation, max file size limit |
| **CORS** | Allowlist of frontend domains only |
| **MongoDB** | Atlas VPC peering + TLS in transit |

---

## Deployment Architecture

```
GitHub (main branch)
  ↓
┌─────────────────────────────────────────────┐
│  Vercel (Frontend)                           │
│  - Automatic deploy on push to main         │
│  - Global CDN edge network                  │
│  - Environment: VITE_API_BASE_URL           │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  Render (Backend)                            │
│  - Auto-deploy from GitHub                  │
│  - Web Service: node server.js              │
│  - Auto-scale on traffic spike              │
│  - Live URL: coastguard-sgwc.onrender.com   │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  MongoDB Atlas (Database)                    │
│  - M0 free tier (512 MB)                    │
│  - Region: Mumbai (ap-south-1)              │
│  - Auto-backup every 6 hours                │
└─────────────────────────────────────────────┘
```

---

*Document maintained by the CoastGuard team. Last updated: December 2024.*
