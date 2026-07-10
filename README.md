# Pragati Placement Portal

Welcome to the Pragati Placement Portal. This guide details how to set up, initialize, and run both the Frontend and Backend services in a new environment.

## Prerequisites

- **Node.js**: v18.x or higher is recommended.
- **PostgreSQL**: An active PostgreSQL database instance.

---

## 1. Installation

Clone the repository and install dependencies in both the `backend` and `frontend` directories:

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

---

## 2. Environment Configuration

The backend requires a `.env` configuration file to communicate with your PostgreSQL instance and sign authentication tokens. 

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
POSTGRESQL_URI=postgresql://<username>:<password>@<host>:<port>/<database_name>
JWT_SECRET=your_jwt_secret_key_here
RESEND_API_KEY=re_dummykey123
```

---

## 3. Database Initialization (Migrations & Seeds)

Pragati uses standard SQL migrations to set up schemas. To build the database tables and populate them with test training data, run the following scripts inside the `backend/` directory:

### Run Migrations (Fresh Database Setup)
```bash
node scripts/migrate.js
```

### Populate Seed Data (Pre-configured Credentials & Trainings)
```bash
node scripts/seed.js
```

---

## 4. Running the Application

### Start the Backend Server (Port 5000)
From the `backend/` directory:
```bash
npm run dev
```

### Start the Frontend Server (Vite)
From the `frontend/` directory:
```bash
npm run dev
```

The frontend will run locally at `http://localhost:5173`.

---

## 5. Pre-seeded Credentials

After running `seed.js`, you can log in immediately using the following accounts:

- **Corporate / Company Account**:
  - **Email**: `company@gmail.com`
  - **Password**: `Password123`
  - *Provides access to Dashboard, Candidate Management, Assessments, Interviews, Training Coordination, and Messages.*

- **Mentor Account**:
  - **Email**: `mentor@example.com`
  - **Password**: `Password123`
  - *Provides access to Mentor feeds, Sessions, and content.*
