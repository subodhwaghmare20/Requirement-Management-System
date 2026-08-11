# Production Deployment Guide

This guide provides step-by-step instructions for deploying the **External Job Opportunity Portal** to production environments, including **MongoDB Atlas**, **Backend Hosting (Render/Railway)**, and **Frontend Hosting (Vercel/Netlify)**.

---

## 1. Database Setup: MongoDB Atlas

1. **Create MongoDB Cluster**:
   - Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a new free-tier cluster (`Shared M0`).
2. **Database User Credentials**:
   - Navigate to **Database Access** -> **Add New Database User**.
   - Set Authentication Method to `Password`.
   - Grant role: `Read and write to any database`.
3. **Network Security & IP Access Whitelist**:
   - Navigate to **Network Access** -> **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) or specify your backend hosting static IP addresses.
4. **Retrieve Connection String**:
   - Click **Database** -> **Connect** -> **Drivers**.
   - Copy the MongoDB URI string:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/external_job_portal?retryWrites=true&w=majority
     ```

---

## 2. Backend Deployment (Render / Railway / VPS)

### Option A: Render (Web Service)
1. **Connect Repository**:
   - Connect your GitHub repository on Render dashboard and choose `server/` root directory.
2. **Environment & Build Settings**:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. **Environment Variables Configured in Render**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Generate a random 64-character secret key>`
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app`

---

## 3. Frontend Deployment (Vercel / Netlify)

### Option A: Vercel
1. **Import Project**:
   - Import GitHub repository on Vercel and set Root Directory to `client`.
2. **Build Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
4. **Single-Page Application (SPA) Rewrites**:
   - Verify `client/vercel.json` (if deployed on Vercel) routes all requests to `/index.html`:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```

---

## 4. Operational Limitations of Free Hosting Services

| Hosting Service | Limitation | Mitigation Strategy |
| :--- | :--- | :--- |
| **Render (Free Tier)** | Web services sleep after 15 minutes of inactivity (causing ~30s cold start delay on first request). | Use external uptime ping service (e.g. UptimeRobot) targeting `GET /api/health` every 10 minutes. |
| **Vercel / Netlify** | Static frontend hosting does not retain local uploaded resume files if uploaded to disk. | Configure `STORAGE_PROVIDER=cloudinary` in backend `.env` to store resumes and logos in Cloudinary CDN. |
| **SameSite Cookies** | Cross-domain HTTP-only cookies require `sameSite: none` and `secure: true` in production. | Ensure both frontend and backend use HTTPS URLs in production. |

---

## 5. Final Production Verification Checklist

Run through this 11-step checklist post-deployment to verify complete functionality:

- [ ] **1. Public Health Check**: Visit `https://your-backend-domain/api/health` -> verify HTTP 200 JSON status.
- [ ] **2. Student Registration**: Register a new student account -> verify redirect to dashboard.
- [ ] **3. Student Login & Session**: Log out and log back in -> verify HTTP-only cookie or Bearer token header transmission.
- [ ] **4. Profile & Resume Setup**: Update course, batch, skills, and upload student resume.
- [ ] **5. Job Discovery & Filters**: Browse published external jobs -> filter by category, location, and work mode.
- [ ] **6. Search Engine**: Search jobs by keyword -> verify instant debounced query results.
- [ ] **7. External Redirect Tracking**: Click **"Apply on External Site"** on an external job drive -> verify redirection to company URL and click count increment.
- [ ] **8. Portal Application Submission**: Apply for a portal job requirement -> verify `APPLIED` status in **My Applications**.
- [ ] **9. Staff & Trainer Dashboard**: Log in as Trainer -> post requirement, edit requirement, and publish drive.
- [ ] **10. HR Applicant Management**: Log in as HR -> open requirement applications, update status to `SHORTLISTED` with remarks.
- [ ] **11. Master Admin Panel**: Log in as Admin -> access `/dashboard/admin`, create Trainer/HR staff user, toggle account status.
