# Security Policy & Hardening Documentation

This document outlines the security design decisions, protection mechanisms, and operational limitations implemented for the **Requirement Management System (External Job Opportunity Portal)**.

---

## 1. Authentication Architecture

- **Password Hashing**: Passwords are saved after hashing via `bcryptjs` using 10 salt rounds (`bcrypt.hash(password, 10)`). Plaintext passwords are never stored or logged.
- **JWT Authentication**: JsonWebTokens are signed using a configurable `JWT_SECRET` key and configured with an explicit 7-day expiration time (`JWT_EXPIRES_IN=7d`).
- **Cookie Security**: Auth tokens are transferred via secure `httpOnly` HTTP cookies (`token`) with `sameSite: lax` protection to mitigate Cross-Site Scripting (XSS) token theft. Bearer token headers in `Authorization: Bearer <token>` are also supported for API client fallbacks.
- **Logout Handling**: Logging out explicitly clears the HTTP-only cookie and removes client-side state.

---

## 2. Role-Based Access Control (RBAC) Authorization Matrix

Every API endpoint is protected via standard Express middleware (`authenticateUser`, `requireRole`):

| Endpoint Route Pattern | Allowed Roles | Access Scope & Guards |
| :--- | :--- | :--- |
| `POST /api/auth/register` | Public | Restricted to `STUDENT` registration only. Staff/Admin creation via register is rejected. |
| `GET/PUT /api/students/me` | `STUDENT` | Students can only access and modify their own profile data. |
| `POST /api/applications` | `STUDENT` | Requires mandatory resume upload in profile prior to applying. Checks drive is published and non-expired. |
| `GET /api/applications/my` | `STUDENT` | Returns only the authenticated student's own portal application history. |
| `GET /api/requirements/trainer/stats` | `TRAINER`, `HR`, `ADMIN` | Trainers see statistics scoped strictly to their own posted requirements. |
| `GET /api/requirements/hr/stats` | `HR`, `ADMIN` | HR/Admin access overall portal statistics. Blocked for `STUDENT` (403 Forbidden). |
| `GET /api/applications/requirement/:id` | `HR`, `ADMIN`, `TRAINER` | Candidate application list. Scoped to HR/Admin or requirement owner for Trainers. Blocked for `STUDENT` (403 Forbidden). |
| `PATCH /api/applications/:id/status` | `HR`, `ADMIN`, `TRAINER` | Updates applicant status and feedback remarks. Blocked for `STUDENT` (403 Forbidden). |
| `GET /api/admin/users` | `ADMIN` | User account directory, search, role filters, active toggles. Restricted to `ADMIN` (403 Forbidden). |
| `POST /api/admin/users` | `ADMIN` | Creates Trainer or HR staff accounts. Restricted to `ADMIN` (403 Forbidden). |
| `GET /api/analytics` | `HR`, `ADMIN` | Analytics metrics and charts. Blocked for `STUDENT` (403 Forbidden). |

---

## 3. Input Validation & ReDoS Sanitization

- **Zod Schemas**: Request bodies for authentication, student profile creation, company creation, and requirement posting are validated against strict Zod schemas.
- **Regex Query Escaping**: User search parameters in `RequirementService`, `CompanyService`, and `AdminService` are passed through `escapeRegex(str)` to prevent Regular Expression Denial of Service (ReDoS) or wildcard query injection.

---

## 4. External URL Protocol Enforcement

- **Protocol Whitelisting**: External application URLs and source URLs are strictly verified via `isSafeUrl()`.
- **Allowed Protocols**: `http:` and `https:` ONLY.
- **Rejected Protocols**: `javascript:`, `data:`, `file:`, `vbscript:`, and other non-web schemes are rejected with HTTP 400 Bad Request.

---

## 5. Security Middlewares

- **Helmet**: Integrated `helmet()` to set standard HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, `Content-Security-Policy`).
- **Rate Limiting**: Integrated `express-rate-limit`:
  - General API rate limiter (200 requests / 15 mins per IP).
  - Auth rate limiter (15 login/register attempts / 15 mins per IP).
- **Request Body Size Limits**: Restricted to `10mb` to prevent payload memory exhaustion attacks.

---

## 6. File Upload Security

- **Allowed Extensions**: `.pdf`, `.doc`, `.docx`.
- **MIME Type Validation**: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- **File Size Limit**: Maximum 5 MB per file.
- **Storage Abstraction**: Configured using `LocalStorageProvider` with fallback Cloudinary provider hooks for object storage.

---

## 7. Secrets & Environment Management

- `.env` files are added to `.gitignore` and are strictly excluded from source control.
- `server/.env.example` is committed with placeholder values only.
