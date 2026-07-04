## 📋 Task Overview
<!-- Brief description of what this backend task involves -->

> 🔀 **Branch to create:** `feature/`
> 🌿 **Base branch:** `develop`
> 👤 **Assigned to:** @
> 👀 **Reviewer:** @
> 📅 **Deadline:**

---

## 📁 Files to Create

```yaml
backend:
  migrations:
    - 00X_create_.sql

  routes:
    - .routes.js

  controllers:
    - .controller.js

  validators:
    - .validator.js
```

> ⚠️ **Do NOT create `authMiddleware.js` or `roleMiddleware.js`**
> They are already created by Backend Intern 1 (Mentor Profile).
> Import them like this:
> ```js
> const authMiddleware = require('../middleware/authMiddleware');
> const roleMiddleware = require('../middleware/roleMiddleware');
> ```

---

## 🗄️ Step 1 — Create Database Tables

**File:** `backend/migrations/00X_create_.sql`

```sql
-- TABLE: 
CREATE TABLE  (
  id         SERIAL PRIMARY KEY,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEX: 
CREATE INDEX idx_
ON ;
```

---

## 🔌 Step 2 — Build These Endpoints

### Endpoint 1: `GET /api/v1/`

| Detail | Value |
|--------|-------|
| **Method** | `GET` |
| **Route** | `/api/v1/` |
| **Auth** | Required — JWT Bearer Token · Role: `` |
| **Request Body** | None |
| **Status Codes** | `200 OK` · `401 Unauthorized` · `403 Forbidden` · `404 Not Found` |

**Response to return:**
```json
{

}
```

---

### Endpoint 2: `PUT /api/v1/`

| Detail | Value |
|--------|-------|
| **Method** | `PUT` |
| **Route** | `/api/v1/` |
| **Auth** | Required — JWT Bearer Token · Role: `` |
| **Status Codes** | `200 OK` · `400 Validation Error` · `401 Unauthorized` · `403 Forbidden` |

**Request body received from frontend:**
```json
{

}
```

**Response to return:**
```json
{
  "success": true,
  "updatedAt": "",
  "data": {}
}
```

---

## 🔐 Step 3 — Wire Up Routes

```js
// .routes.js

const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {  } = require('../controllers/.controller');

router.get('/', authMiddleware, roleMiddleware(''), );
router.put('/', authMiddleware, roleMiddleware(''), );

module.exports = router;
```

---

## ⚠️ Important Rules

- Do **NOT** hardcode `JWT_SECRET` — store in `.env` only
- Do **NOT** touch any other controller or service file
- Do **NOT** change any route names — frontend depends on exact paths
- Do **NOT** recreate `authMiddleware.js` or `roleMiddleware.js` — import only
- All routes must pass through `authMiddleware` before the controller
- Use a **single PostgreSQL transaction** for all write operations
- If any query returns no rows → return `[]` or `0`, never `null`
- Confirm `.env` is in `.gitignore` — never commit secrets

---

## 🖥️ Git Commands — Follow These Exactly

### Step 1 — First Time Setup
```bash
git clone https://github.com/krishnabackup/Pragati.git
cd Pragati
git checkout develop
git pull origin develop
git checkout -b feature/
```

### Step 2 — Daily Work
```bash
git add .
git commit -m "feat: describe what you built"
git push origin feature/
```

### Step 3 — Stay Updated Every Day
```bash
git fetch origin
git rebase origin/develop
```

### Step 4 — When Task is Complete
```bash
# 1. Go to: https://github.com/krishnabackup/Pragati
# 2. Click: Pull Requests → New Pull Request
# 3. FROM: feature/   →   TO: develop
# 4. Title: [BE]  - DB Migration + APIs
# 5. Tag reviewer
# 6. Do NOT merge yourself — wait for reviewer approval
```

---

## 🚫 Do NOT Touch These Files

- `authMiddleware.js` — import only, never edit
- `roleMiddleware.js` — import only, never edit
- Any migration file already created
- Any file inside the `frontend/` folder
- Any file not listed in the **Files to Create** section above

---

## ✅ Acceptance Criteria

- [ ] Migration file created with all correct columns, constraints, and indexes
- [ ] All endpoints return correct response shape
- [ ] All routes protected by `authMiddleware` and `roleMiddleware`
- [ ] Missing token returns `401`
- [ ] Invalid or expired token returns `401`
- [ ] Wrong role returns `403`
- [ ] All validation errors return `400` with a clear error message
- [ ] Missing record returns `404`
- [ ] Empty query results return `[]` or `0` — not `null`
- [ ] `JWT_SECRET` stored in `.env` only — not hardcoded anywhere
- [ ] `500` error returns a proper message — no stack trace exposed
- [ ] Tested in Postman — all status codes verified