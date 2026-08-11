# External Job Opportunity Portal (Requirement Management System)

A full-stack enterprise web application designed for institutes and universities to manage, discover, and track **EXTERNAL** hiring drives and job opportunities.

> **Note**: This portal is strictly for external placement drives. Internal company placement requirements are governed separately.

---

## 🌟 Key Capabilities

- **Student Portal**: Discover external job drives with debounced search, multi-faceted filtering (category, work mode, job type, salary range, location), application tracking, and bookmarking.
- **Trainer Workplace**: Create, publish, close, edit, and track statistics for external job requirements.
- **HR Placement Panel**: Candidate application reviews across all portal opportunities, status workflow updates (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`), and feedback remarks.
- **Master Admin Panel**: System-wide control center for managing Users (search, role filtering, create Trainer/HR staff accounts, activate/deactivate toggles), Categories, Companies, Requirements, and Analytics.
- **Analytics Engine**: Real-time KPI counters, 6 analytical distribution charts (by technology, location, platform, monthly trends), and transparent **"External Apply Clicks"** tracking.
- **In-App Notifications**: Real-time notification feed and navbar bell dropdown with unread badge counter.
- **Security Hardening**: `helmet` HTTP headers, `express-rate-limit`, ReDoS regex sanitization, URL protocol safety checks (`http:`/`https:` only), file upload validation, and RBAC authorization guards.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router DOM.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JsonWebTokens, bcryptjs, Multer, Zod, Helmet, Express-Rate-Limit.
- **Database**: MongoDB (Local or MongoDB Atlas).

---

## 📁 Repository Structure

```
Requirement Management System/
├── client/                 # Vite + React Frontend Application
│   ├── src/
│   │   ├── components/     # UI Components (Layout, Requirements, Applications, Company)
│   │   ├── context/        # Auth, Toast Context
│   │   ├── pages/          # Student, Trainer, HR, Admin Pages
│   │   ├── services/       # Axios API client & services
│   │   └── types/          # TypeScript domain interfaces
│   ├── .env.example
│   └── package.json
├── server/                 # Express + TypeScript API Server
│   ├── src/
│   │   ├── controllers/    # API Controllers
│   │   ├── middleware/     # Auth, Error, Rate Limiting
│   │   ├── models/         # Mongoose Schemas (User, Requirement, Application, etc.)
│   │   ├── routes/         # Express Route Modules
│   │   ├── services/       # Business Logic Services
│   │   └── validators/     # Zod Validation Schemas
│   ├── .env.example
│   └── package.json
├── SECURITY.md             # Security Hardening & RBAC Matrix
├── DEPLOYMENT.md           # Production Deployment Guide
└── README.md               # Main Project Documentation
```

---

## ⚡ Quick Start Guide (Local Setup)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas connection string)

### 2. Environment Setup

Copy `.env.example` files to `.env` in both `server/` and `client/`:

```bash
# Server Environment Setup
cd server
cp .env.example .env

# Client Environment Setup
cd ../client
cp .env.example .env
```

### 3. Server Installation & Seed

```bash
cd server
npm install
npm run seed  # Optional: Seeds sample categories, companies, requirements, and default admin/trainer/student users
npm run dev   # Starts API server on http://localhost:5000
```

### 4. Client Installation

```bash
cd ../client
npm install
npm run dev   # Starts Vite client on http://localhost:3000
```

---

## 🧪 Testing

Execute the master automated integration test suite:

```bash
cd server
node ../scratch/test_master_suite.js
```

---

## 📄 License & System Notice

Designed for Educational & Enterprise Placement Management. All Rights Reserved.
