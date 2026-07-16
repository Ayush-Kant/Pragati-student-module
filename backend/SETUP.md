# 🛠️ Setup Guide — Pragati Company Panel Backend

## Prerequisites

| Tool | Version Required |
|------|-----------------|
| Node.js | >= 18.x |
| npm | >= 9.x |
| PostgreSQL | >= 14.x |
| Git | >= 2.x |

---

## 📥 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Pragati-Uptoskills/Pragati.git
cd Pragati/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Copy the example env file and fill in your values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
# PostgreSQL Connection
POSTGRESQL_URI=postgresql://your_user:your_password@localhost:5432/pragati

# Authentication
JWT_SECRET=your_super_secret_key_here

# Server
PORT=5000
NODE_ENV=development
```

---

## 🗄️ Database Setup

### 1. Create Database
```bash
psql -U postgres -c "CREATE DATABASE pragati;"
```

### 2. Run All Migrations (in order)
```bash
# Option A: Use migration script
node scripts/migrate.js

# Option B: Manual (run in psql)
psql -U your_user -d pragati -f migrations/001_create_users_mentors.sql
psql -U your_user -d pragati -f migrations/002_create_content_tables.sql
psql -U your_user -d pragati -f migrations/003_create_admin_dashboard.sql
psql -U your_user -d pragati -f migrations/004_create_college_management.sql
psql -U your_user -d pragati -f migrations/005_create_company_management.sql
psql -U your_user -d pragati -f migrations/006_create_training_coordination.sql
```

### 3. Seed Test Data
```bash
node scripts/seed.js
```

This creates:
- 1 Company (Google)
- 1 Mentor (John Doe)
- 1 Student (Alice)
- 2 Training programs (T101 React Bootcamp, T102 Node.js Advanced)
- 1 Training progress record
- 1 Mentor feedback record

---

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
# or
npm start
```

Server starts on: `http://localhost:5000`

Expected output:
```
✅ PostgreSQL connected
🚀 Server running on port 5000
```

---

## 🧪 Running Tests

### All Tests
```bash
npm test
```

Expected result:
```
PASS tests/trainingAPI.test.js    (10/10 ✅)
PASS tests/trainingService.test.js (14/14 ✅)

Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
```

### Unit Tests Only
```bash
npm test -- tests/trainingService.test.js
```

### Integration Tests Only
```bash
npm test -- tests/trainingAPI.test.js
```

### With Coverage Report
```bash
npm test -- --coverage
```

Expected coverage: **~86% statements, ~87% lines**

---

## 🔍 Code Quality

### ESLint
```bash
npx eslint controllers/trainingController.js services/trainingService.js middleware/ routes/trainingRoutes.js
# Expected: EXIT 0 — no errors, no warnings
```

---

## 📋 Module 6: Training Coordination API

All endpoints prefixed with: `/api/v1/company/training`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all training programs |
| GET | `/:id` | Get training by ID |
| PATCH | `/:id/assign-mentor` | Assign mentor to training |
| GET | `/:id/progress` | Get training analytics |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full details.

---

## 🌲 Project Structure

```
backend/
├── config/
│   ├── db.js              # PostgreSQL connection (pg)
│   └── sequelize.js       # Sequelize instance
├── controllers/
│   └── trainingController.js   # Module 6 controller
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   ├── roleMiddleware.js  # Role-based access
│   └── validation.js      # Joi request validation
├── migrations/
│   ├── 001_create_users_mentors.sql
│   ├── 002_create_content_tables.sql
│   ├── 003_create_admin_dashboard.sql
│   ├── 004_create_college_management.sql
│   ├── 005_create_company_management.sql
│   └── 006_create_training_coordination.sql
├── routes/
│   └── trainingRoutes.js  # Module 6 routes
├── scripts/
│   ├── migrate.js         # Run migrations
│   └── seed.js            # Seed database
├── services/
│   └── trainingService.js # Business logic (6 methods)
├── src/models/
│   ├── Company.js
│   ├── Mentor.js
│   ├── MentorFeedback.js
│   ├── Student.js
│   ├── Training.js
│   ├── TrainingProgress.js
│   └── User.js
├── tests/
│   ├── trainingAPI.test.js     # Integration tests
│   └── trainingService.test.js # Unit tests
├── .env.example
├── .env (gitignored)
├── API_DOCUMENTATION.md
├── SETUP.md
├── eslint.config.js
├── jest.config.js
├── package.json
└── server.js
```

---

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRESQL_URI` | ✅ Yes | PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT signing |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment (development/production) |

---

## 🚨 Troubleshooting

### "Cannot connect to PostgreSQL"
- Verify PostgreSQL is running: `pg_isready`
- Check `POSTGRESQL_URI` in `.env`
- Ensure database `pragati` exists

### "JWT_SECRET is not defined"
- Ensure `.env` file exists in `backend/` directory
- Verify `JWT_SECRET=...` is set

### "Table does not exist"
- Run migrations in order (001 → 006)
- Verify migration was successful: `psql -d pragati -c "\dt"`

### Tests failing
- Ensure database is running and seeded
- Check `.env` has correct `POSTGRESQL_URI`
- Run `node scripts/seed.js` to re-seed data
