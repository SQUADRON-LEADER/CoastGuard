# CoastGuard API Reference

**Base URL:** `https://coastguard-sgwc.onrender.com`  
**All endpoints are prefixed with** `/api`  
**Authentication:** Bearer JWT token in `Authorization` header

---

## Authentication

### Register a New User

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "SecurePass@123",
  "role": "citizen_reporter"
}
```

**Available Roles:** `citizen_reporter` | `community_validator` | `verifier_protector`

**Success Response:** `201 Created`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789...",
    "name": "Arjun Sharma",
    "email": "arjun@example.com",
    "role": "citizen_reporter",
    "points": 0
  }
}
```

---

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "arjun@example.com",
  "password": "SecurePass@123"
}
```

**Success Response:** `200 OK`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Success Response:** `200 OK`

```json
{
  "_id": "64a1b2c3...",
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "role": "citizen_reporter",
  "points": 150,
  "createdAt": "2024-11-01T10:30:00Z"
}
```

---

## Disaster Reports

### Submit a New Hazard Report

```http
POST /api/reports
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ | Short report title |
| `description` | string | ✅ | Detailed description |
| `severity` | string | ✅ | `low` \| `medium` \| `high` \| `critical` |
| `category` | string | ✅ | `cyclone` \| `flood` \| `tsunami` \| `fire` \| `oil_spill` \| `infrastructure` \| `other` |
| `latitude` | number | ✅ | GPS latitude |
| `longitude` | number | ✅ | GPS longitude |
| `image` | file | ❌ | Photo/video file (max 10 MB) |

**Success Response:** `201 Created`

```json
{
  "_id": "64b2c3d4e5f6789...",
  "title": "Flooding at Juhu Beach",
  "severity": "high",
  "category": "flood",
  "location": { "lat": 19.0990, "lng": 72.8264 },
  "imageUrl": "/uploads/report-123.jpg",
  "status": "pending",
  "userId": "64a1b2c3...",
  "createdAt": "2024-11-15T08:45:00Z"
}
```

---

### Get All Reports

```http
GET /api/reports
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20) |
| `severity` | string | Filter by severity level |
| `category` | string | Filter by disaster category |
| `status` | string | `pending` \| `verified` \| `rejected` |

**Success Response:** `200 OK`

```json
{
  "reports": [ { ... }, { ... } ],
  "total": 142,
  "page": 1,
  "pages": 8
}
```

---

### Verify a Report (Verifier Protector only)

```http
PUT /api/reports/:id/verify
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "verified",
  "verifierNote": "Confirmed via satellite imagery cross-reference"
}
```

---

### Export Verified Reports as CSV

```http
GET /api/reports/export/csv
Authorization: Bearer <token>
```

**Response:** `text/csv` file download with all verified disaster reports.

---

## Weather & Advisories

### Get Coastal Weather Advisories

```http
GET /api/weather/advisories
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `state` | string | Coastal state (e.g. `kerala`, `gujarat`, `tamilnadu`) |

**Success Response:** `200 OK`

```json
{
  "advisories": [
    {
      "state": "Kerala",
      "bulletin": "Strong winds 45-55 knots expected along Kerala coast",
      "waveHeight": "3.5m",
      "stormSurge": "0.8m above normal",
      "validity": "24 hours",
      "issuedAt": "2024-11-15T06:00:00Z"
    }
  ]
}
```

---

## Geofence & Maritime Boundary

### Check Maritime Risk

```http
POST /api/geofence/check-risk
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "latitude": 9.9312,
  "longitude": 76.2673
}
```

**Success Response:** `200 OK`

```json
{
  "distanceToIMBL": 42.7,
  "unit": "nautical miles",
  "riskLevel": "low",
  "message": "You are within safe fishing zone. 42.7 NM from IMBL.",
  "nearestBoundaryPoint": { "lat": 9.45, "lng": 74.8 }
}
```

---

## Relief Camps

### Get All Active Relief Camps

```http
GET /api/relief-camps
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `state` | string | Filter by state |
| `available` | boolean | Only camps with available capacity |

**Success Response:** `200 OK`

```json
{
  "camps": [
    {
      "_id": "64c3d4e5f6789...",
      "name": "Kochi Community Relief Center",
      "state": "Kerala",
      "capacity": 500,
      "currentOccupancy": 347,
      "availableSlots": 153,
      "foodSupply": "adequate",
      "medicalTeam": true,
      "coordinates": { "lat": 9.9312, "lng": 76.2673 },
      "contactNumber": "+91-484-2345678"
    }
  ]
}
```

---

## Emergency Contacts

### Get Emergency Helplines

```http
GET /api/emergency-contacts
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `region` | string | Filter by coastal region |
| `category` | string | `coast_guard` \| `ndrf` \| `marine_police` \| `hospital` |

**Success Response:** `200 OK`

```json
{
  "contacts": [
    {
      "name": "Indian Coast Guard Emergency",
      "number": "1554",
      "category": "coast_guard",
      "region": "Pan-India",
      "available24x7": true
    },
    {
      "name": "NDRF Helpline",
      "number": "1078",
      "category": "ndrf",
      "region": "Pan-India",
      "available24x7": true
    }
  ]
}
```

---

## Alerts & Notifications

### Trigger Emergency Alert (Verifier Protector only)

```http
POST /api/alerts/trigger
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "reportId": "64b2c3d4e5f6789...",
  "severity": "critical",
  "message": "Confirmed cyclone making landfall at Puri coast. Immediate evacuation required.",
  "notifyVoice": true,
  "notifySMS": true,
  "notifyEmail": true
}
```

**Success Response:** `200 OK`

```json
{
  "success": true,
  "voiceCallSid": "CA1234...",
  "smsSid": "SM5678...",
  "emailsSent": 3,
  "message": "Alert dispatched to 3 authority contacts"
}
```

---

## Community & Leaderboard

### Get Leaderboard

```http
GET /api/leaderboard
Authorization: Bearer <token>
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `limit` | number | Top N users (default: 10) |
| `period` | string | `all_time` \| `monthly` \| `weekly` |

**Success Response:** `200 OK`

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "Priya Nair",
      "points": 2450,
      "verifiedReports": 38,
      "badge": "Coastal Guardian"
    }
  ]
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Unauthorized — invalid or expired token",
  "statusCode": 401
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — missing or invalid parameters |
| `401` | Unauthorized — invalid or missing JWT token |
| `403` | Forbidden — insufficient role permissions |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — resource already exists (e.g. duplicate email) |
| `422` | Unprocessable Entity — validation failed |
| `500` | Internal Server Error — unexpected server failure |

---

*CoastGuard API v1.0 · Last updated: December 2024*
