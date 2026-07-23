# 📚 Placement Drive Management Backend Module

## 📌 Project Overview

Develop a **complete Placement Drive Management Backend Module** using **Node.js, Express.js, and PostgreSQL**.

The backend provides secure REST APIs, business logic, database models, middleware, validation, authentication, authorization, and PostgreSQL integration required by the Placement Drive Management Frontend.

The project follows a clean layered backend architecture.

```text
Client (Frontend / Thunder Client)
               │
               ▼
            Routes
               │
               ▼
      Authentication Middleware
               │
               ▼
      Authorization Middleware
               │
               ▼
          Validators
               │
               ▼
         Controllers
               │
               ▼
           Services
               │
               ▼
            Models
               │
               ▼
        PostgreSQL Database
```

---

# 🎯 Objective

Develop a production-style backend module capable of:

* Managing placement drives
* Managing eligibility criteria
* Managing interview rounds
* Managing drive schedules
* Managing placement statistics
* Securing APIs using JWT Authentication
* Validating incoming requests
* Handling errors globally
* Performing complete CRUD operations
* Supporting frontend integration

---

# 💻 Technology Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JWT
* bcrypt

### Middleware

* CORS
* Express JSON Parser
* Error Middleware
* Authentication Middleware
* Role Middleware

### API Testing

* Thunder Client

### Environment Variables

* dotenv

---

# 📂 Backend Folder Structure

```
backend/

src/

│
├── config/
│      db.js
│
├── controllers/
│      auth.controller.js
│      placementDrive.controller.js
│      eligibility.controller.js
│      interviewRound.controller.js
│      schedule.controller.js
│
├── middleware/
│      authMiddleware.js
│      roleMiddleware.js
│      errorMiddleware.js
│
├── models/
│      placementDrive.model.js
│      eligibility.model.js
│      interviewRound.model.js
│      schedule.model.js
│
├── services/
│      placementDrive.service.js
│      eligibility.service.js
│      interviewRound.service.js
│      schedule.service.js
│
├── validators/
│      placementDrive.validator.js
│      eligibility.validator.js
│      interviewRound.validator.js
│      schedule.validator.js
│
├── routes/
│      auth.routes.js
│      placementDrive.routes.js
│
├── app.js
│
└── server.js

.env

package.json
```

---

# 🗄 Database

## Shared Tables

```
users

college_profiles
```

---

## Placement Drive Tables

```
placement_drives

drive_statistics

drive_eligibility

interview_rounds

drive_schedule
```

Total Tables

```
7
```

---

# Database Relationship

```
placement_drives

│

├──────── drive_statistics

├──────── drive_eligibility

├──────── interview_rounds

└──────── drive_schedule
```

---

# Constraints

Implemented

* Primary Key

* Foreign Key

* NOT NULL

* CHECK Constraints

* Query Optimization

* Indexes

Status Constraint

```
Upcoming

Open

Closed

Completed
```

---

# Database Configuration

Configured PostgreSQL connection using

```
pg Pool
```

Implemented

* Connection Pool

* Environment Variables

* SSL Support

* Timeout

* Connection Test

Database File

```
config/db.js
```

---

# Models

## Placement Drive Model

Implemented

```
getAllPlacementDrives()

getPlacementDriveById()

createPlacementDrive()

updatePlacementDrive()

deletePlacementDrive()

searchPlacementDrives()

getDriveStatistics()
```

Responsibilities

* SQL Queries

* CRUD Operations

* Statistics Queries

* Search Queries

---

## Eligibility Model

Implemented

```
getEligibilityCriteria()

createEligibilityCriteria()

updateEligibilityCriteria()

deleteEligibilityCriteria()
```

---

## Interview Round Model

Implemented

```
getInterviewRounds()

createInterviewRound()

updateInterviewRound()

deleteInterviewRound()
```

---

## Schedule Model

Implemented

```
getDriveSchedule()

updateDriveSchedule()
```

---

# Services

Created service layer for business logic.

Responsibilities

* CRUD Operations

* Business Logic

* Query Optimization

* Response Formatting

* Search

* Statistics

---

# Controllers

Created

```
placementDrive.controller.js

eligibility.controller.js

interviewRound.controller.js

schedule.controller.js
```

Total Controller Functions

```
17
```

Placement Drive

```
getPlacementDrives()

getPlacementDriveById()

createPlacementDrive()

updatePlacementDrive()

deletePlacementDrive()

searchPlacementDrives()

getDriveStatistics()
```

Eligibility

```
getEligibility()

createEligibility()

updateEligibility()

deleteEligibility()
```

Interview Round

```
getInterviewRounds()

createInterviewRound()

updateInterviewRound()

deleteInterviewRound()
```

Schedule

```
getDriveSchedule()

updateSchedule()
```

Responsibilities

* Handle Request

* Handle Response

* HTTP Status Codes

* Exception Handling

---

# Validators

Created

```
placementDrive.validator.js

eligibility.validator.js

interviewRound.validator.js

schedule.validator.js
```

Validation Rules

* Required Fields

* Company Validation

* Role Validation

* Package Validation

* Date Validation

* Deadline Validation

* CGPA Validation

* Duplicate Validation

* Null Validation

* Input Sanitization

---

# Middleware

Created

## authMiddleware

Responsibilities

* JWT Verification

* Bearer Token Validation

* Invalid Token Handling

* Expired Token Handling

---

## roleMiddleware

Responsibilities

* Role Authorization

* Admin Access

* Student Access

* Permission Validation

---

## errorMiddleware

Responsibilities

* Global Error Handling

* PostgreSQL Error Handling

* Validation Errors

* 404 Handling

* Exception Handling

---

# Authentication

Login API

```
POST

/api/auth/login
```

Returns

```
JWT Token
```

Used in Thunder Client

```
Authorization

Bearer <JWT Token>
```

---

# REST APIs

## Placement Drive

```
GET

/api/placement-drives
```

```
GET

/api/placement-drives/:id
```

```
POST

/api/placement-drives
```

```
PUT

/api/placement-drives/:id
```

```
DELETE

/api/placement-drives/:id
```

---

## Search

```
GET

/api/placement-drives/search?q=Google
```

```
GET

/api/placement-drives/statistics
```

---

## Eligibility

```
GET

/api/placement-drives/:id/eligibility
```

```
POST

/api/placement-drives/:id/eligibility
```

```
PUT

/api/placement-drives/:id/eligibility
```

```
DELETE

/api/placement-drives/:id/eligibility
```

---

## Interview Round

```
GET

/api/placement-drives/:id/rounds
```

```
POST

/api/placement-drives/:id/rounds
```

```
PUT

/api/placement-drives/:id/rounds/:roundId
```

```
DELETE

/api/placement-drives/:id/rounds/:roundId
```

---

## Schedule

```
GET

/api/placement-drives/:id/schedule
```

```
PUT

/api/placement-drives/:id/schedule
```

---

## Authentication

```
POST

/api/auth/login

POST

/api/auth/register
```

---

# Total APIs

| Module          | APIs |
| --------------- | ---- |
| Placement Drive | 7    |
| Eligibility     | 4    |
| Interview Round | 4    |
| Schedule        | 2    |
| Authentication  | 2    |

**Total REST APIs = 19**

---

# Thunder Client Testing Workflow

## Step 1

Start Backend

```
npm run dev
```

Expected

```
✅ PostgreSQL Connected

✅ Server Running
```

---

## Step 2

Login

```
POST

/api/auth/login
```

Body

```json
{
  "email":"admin@gmail.com",
  "password":"Admin123"
}
```

Copy JWT Token.

---

## Step 3

Authorization

Headers

```
Authorization

Bearer <JWT Token>
```

---

## Step 4

Placement Drive CRUD

### Get All

```
GET

/api/placement-drives
```

Expected

```
200 OK
```

---

### Get By ID

```
GET

/api/placement-drives/4
```

Expected

```
200 OK
```

---

### Create

```
POST

/api/placement-drives
```

```json
{
  "company":"Amazon",
  "role":"SDE",
  "package":30,
  "drive_date":"2026-11-15",
  "deadline":"2026-11-10",
  "status":"Upcoming"
}
```

Expected

```
201 Created
```

---

### Update

```
PUT

/api/placement-drives/4
```

Expected

```
200 OK
```

---

### Delete

```
DELETE

/api/placement-drives/4
```

Expected

```
200 OK
```

---

### Search

```
GET

/api/placement-drives/search?q=Google
```

Expected

```
200 OK
```

---

### Statistics

```
GET

/api/placement-drives/statistics
```

Expected

```
200 OK
```

---

### Eligibility

```
GET

POST

PUT

DELETE

/api/placement-drives/4/eligibility
```

Expected

```
200 / 201 / 200 / 200
```

---

### Interview Rounds

```
GET

POST

PUT

DELETE

/api/placement-drives/4/rounds
```

Expected

```
200 / 201 / 200 / 200
```

---

### Schedule

```
GET

PUT

/api/placement-drives/4/schedule
```

Expected

```
200 / 200
```

---

# PostgreSQL Commands

Show Tables

```sql
\dt
```

View Placement Drives

```sql
SELECT * FROM placement_drives;
```

View Statistics

```sql
SELECT * FROM drive_statistics;
```

View Eligibility

```sql
SELECT * FROM drive_eligibility;
```

View Interview Rounds

```sql
SELECT * FROM interview_rounds;
```

View Schedule

```sql
SELECT * FROM drive_schedule;
```

---

# Problems Solved During Development

* Connected PostgreSQL successfully.
* Configured `.env` with the correct PostgreSQL URI.
* Fixed `POST /api/auth/login` route registration.
* Registered missing routes in `server.js`.
* Removed invalid `company_id` and `job_id` references from SQL queries.
* Corrected status validation to match the database `CHECK` constraint.
* Resolved `404 Placement Drive not found` errors by using valid database IDs.
* Fixed PostgreSQL schema mismatches.
* Implemented JWT authentication and role authorization.
* Verified all CRUD operations using Thunder Client.
* Confirmed database inserts, updates, deletes, and searches.
* Tested every endpoint successfully.

---

# Project Outcome

The Placement Drive Management Backend module now includes:

* Complete layered architecture.
* PostgreSQL integration.
* Secure JWT authentication.
* Role-based authorization.
* Request validation and sanitization.
* CRUD operations for placement drives.
* Eligibility management.
* Interview round management.
* Schedule management.
* Search and statistics APIs.
* Global error handling.
* Complete Thunder Client API testing.
* Verified PostgreSQL data operations.

---

# Final Completion Summary

| Component               | Status                   |
| ----------------------- | ------------------------ |
| Database Schema         | ✅ Completed              |
| PostgreSQL Integration  | ✅ Completed              |
| Models                  | ✅ Completed              |
| Services                | ✅ Completed              |
| Controllers             | ✅ Completed              |
| Validators              | ✅ Completed              |
| Middleware              | ✅ Completed              |
| Authentication          | ✅ Completed              |
| Authorization           | ✅ Completed              |
| Placement Drive CRUD    | ✅ Completed              |
| Eligibility APIs        | ✅ Completed              |
| Interview Round APIs    | ✅ Completed              |
| Schedule APIs           | ✅ Completed              |
| Search APIs             | ✅ Completed              |
| Statistics APIs         | ✅ Completed              |
| Thunder Client Testing  | ✅ Completed              |
| PostgreSQL Verification | ✅ Completed              |
| Backend Module          | ✅ Successfully Completed |

---

## Overall Status

**Project Name:** Placement Drive Management Backend Module

**Architecture:** Routes → Controllers → Validators → Services → Models → PostgreSQL

**Technology:** Node.js, Express.js, PostgreSQL, JWT

**Controller Files:** 4

**Controller Functions:** 17

**REST APIs:** 19

**Database Tables:** 7 (5 module-specific + 2 shared)

**Testing Tool:** Thunder Client

**Project Status:** **Successfully Completed and Ready for Team Integration**
