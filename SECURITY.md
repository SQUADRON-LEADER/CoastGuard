# Security Policy

## Supported Versions

The following versions of CoastGuard are currently supported with security updates:

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | ✅ Active support  |
| < 1.0   | ❌ No longer supported |

---

## Reporting a Vulnerability

The CoastGuard team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### ⚠️ DO NOT report security vulnerabilities through public GitHub Issues.

Instead, please follow the responsible disclosure process below:

### 📧 Private Disclosure

1. **Open a private security advisory** on GitHub:
   [https://github.com/SQUADRON-LEADER/CoastGuard/security/advisories/new](https://github.com/SQUADRON-LEADER/CoastGuard/security/advisories/new)

2. Include the following in your report:
   - **Type of issue** (e.g. SQL injection, XSS, authentication bypass, insecure API endpoint)
   - **Full path** of the source file(s) related to the vulnerability
   - **Location** of the affected source code (tag/branch/commit or direct URL)
   - **Step-by-step instructions** to reproduce the issue
   - **Proof-of-concept or exploit code** (if possible)
   - **Impact** of the issue, including how an attacker might exploit it

### Response Timeline

| Stage | Timeline |
|---|---|
| Acknowledgement of your report | Within **48 hours** |
| Initial assessment and triage | Within **5 business days** |
| Fix developed | Within **14 days** (critical), **30 days** (medium/low) |
| Public disclosure (after fix) | Coordinated with reporter |

---

## Security Considerations in CoastGuard

### Authentication & Authorization
- All protected API routes require a valid **JWT token** in the `Authorization: Bearer <token>` header
- Tokens expire after **7 days** by default
- Passwords are hashed using **bcryptjs** with a salt factor of 12 — never stored in plaintext
- Role-based access control (RBAC) prevents privilege escalation between the 3 user tiers

### Data Security
- **MongoDB Atlas** connection uses TLS/SSL encryption in transit
- All environment secrets (API keys, DB URIs, SMTP passwords) are managed via `.env` files, excluded from version control via `.gitignore`
- Uploaded images (Multer) are validated for MIME type before processing

### Third-Party Integrations
- **Twilio** credentials are server-side only — never exposed to the frontend
- **Google Gemini** API key is backend-only
- **Mapbox** access tokens are restricted by domain in the Mapbox dashboard

### Known Security Limitations (Disclosure)
- The current version does not implement **rate limiting** on login endpoints — planned for v1.1.0
- File upload size is limited by Multer config but further CDN-level scanning is not yet implemented
- CORS is configured to allow the specific frontend domain only

---

## Scope

The following are **in scope** for security reports:

- Authentication and authorization flaws
- Injection vulnerabilities (SQL, NoSQL, command injection)
- Cross-Site Scripting (XSS)
- Sensitive data exposure via API responses
- Insecure direct object references (IDOR)
- Business logic vulnerabilities in the disaster reporting pipeline

The following are **out of scope**:

- Denial of Service (DoS) attacks
- Social engineering
- Physical security attacks
- Issues in third-party services (Twilio, MongoDB Atlas, Google Gemini) — report those to the respective vendors

---

## Hall of Fame

We publicly acknowledge responsible security researchers who help us keep CoastGuard safe:

| Researcher | Vulnerability | Severity |
|---|---|---|
| *(none yet — be the first!)* | — | — |

---

Thank you for helping keep CoastGuard and India's coastal communities safe. 🌊🔐
