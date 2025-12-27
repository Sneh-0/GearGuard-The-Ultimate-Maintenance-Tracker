# Team Name: Pilots of Copilot
# Team Members: 
- Sneh Shah
- Meet Modi
- Ved Gandhi
- Vidhi Goswami

# GearGuard — The Ultimate Maintenance Tracker

**Full-stack maintenance tracking app:**
- **Frontend:** React + Vite + Tailwind
- **Backend:** Node.js (Express, ESM) + MongoDB

The frontend uses live API endpoints (no mock data). Role-aware UI and server validation are implemented for Admin, Manager, and Technician.

## Prerequisites
- Node.js 18+ (LTS)
- MongoDB Server (localhost:27017)
- Windows PowerShell (commands below) or your preferred shell


### 2) Configure backend environment

Create a `.env` file in the **backend** directory:

```env
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=4000

```

### 3) Install and run backend

```powershell
cd backend
npm install
npm run dev

```

Backend will listen on `http://localhost:4000` and expose REST API under `/api`.

### 4) Seed demo data (optional but recommended)

```powershell
# Run the seed script to create demo users and basic collections
node scripts\init-mongo.js

```

**Demo accounts:**

* **Admin:** admin@gearguard.com / admin123
* **Manager:** manager@gearguard.com / manager123
* **Technician:** tech@gearguard.com / tech123

### 5) Configure and run frontend

Create a `.env` file in the **frontend** directory (or use defaults):

```env
VITE_API_BASE_URL=http://localhost:4000/api

```

Install and start Vite dev server:

```powershell
cd frontend
npm install
npm run dev

```

Frontend will start on `http://localhost:5173`.

## Features & Roles

* **Dashboard**
* Technicians see only requests assigned to their team(s) or directly to them.
* Technicians can mark a request as "Completed" directly from the dashboard.


* **Equipment Management**
* All roles (Admin, Manager, Technician) can toggle equipment status between Operational and Unoperational.


* **Maintenance Requests**
* Full CRUD with persistence.
* Kanban board reflects live status after edits.
* Past-date scheduling is blocked.


* **Calendar Scheduling**
* Click a date to schedule maintenance (Preventive or Corrective), set priority and notes.
* Admin/Manager can assign a team during scheduling.
* Technicians cannot add or remove calendar-scheduled requests.


* **Teams**
* Members must be existing Technicians (by email); team lists show technician name and email.
* Structured member inputs with dropdown selection.


* **Authentication**
* Registration and login.
* Forgot Password: request a reset token (demo returns token) and reset via the Reset page.



## API Endpoints

* **Auth:** `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot`, `/api/auth/reset`
* **Equipment:** `/api/equipment` (GET, POST, PUT, DELETE)
* **Maintenance:** `/api/maintenance-requests` (GET, POST, PATCH, DELETE)
* **Teams:** `/api/teams` (GET, POST, PUT, DELETE)
* **Users:** `/api/users/technicians` (GET)
* **Calendar:** `/api/calendar/events` (GET)
* **Reports:** `/api/reports/summary` (GET)

*Frontend calls include the current role via the `X-User-Role` header for server-side enforcement.*

## Forgot Password (Demo Flow)

In development, the backend can return a reset token instead of sending email:

1. Open the Forgot Password page and submit your email.
2. Copy the demo token shown and proceed to the Reset page (auto-navigates when using the UI).
3. Enter the token and new password to update your account.

> **Note:** For production, send email links and store only a hash of the token with an expiry. Do not return raw tokens from the API.

## Troubleshooting

**Backend won’t start (Exit Code: 1)**

* Ensure `.env` is present in backend with a valid `MONGODB_URI` and `PORT`.
* Confirm MongoDB is running: `Get-Service MongoDB` and `Start-Service MongoDB`.
* Check Node.js version: `node -v` (use 18+).
* Inspect the first error line in the terminal; fix missing packages with `npm install`.

**Frontend won’t start (Exit Code: 1)**

* Confirm `VITE_API_BASE_URL` is set to `http://localhost:4000/api`.
* Run `npm install` in frontend.
* If Vite reports JSX or syntax errors, check recent edits in calendar and pages.

**CORS / API connection issues**

* Backend must run on `http://localhost:4000`.
* Ensure the frontend `VITE_API_BASE_URL` matches exactly.

**Port already in use**

* Change `PORT` in backend `.env` and update `VITE_API_BASE_URL` accordingly, then restart both.

## Project Structure

* **Frontend:** `frontend/` (React, Vite, Tailwind)
* **Backend:** `backend/` (Express, routes under `backend/src/routes/`)
* **Seed script:** `backend/scripts/init-mongo.js`

## Development Tips

* Run backend and frontend in separate terminals.
* Use demo accounts to explore role-based behavior quickly.
* When modifying backend routes, restart the backend dev server to apply changes.

```

```
