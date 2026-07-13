# Live Session API Documentation

## Base URL
http://localhost:5000/api/student/live-sessions

## Authentication
All routes require a Bearer JWT token with the `student` role.

## Endpoints

### Live Sessions
- GET /api/student/live-sessions
- GET /api/student/live-sessions/:id
- POST /api/student/live-sessions/:id/join
- POST /api/student/live-sessions/:id/leave

### Attendance
- GET /api/student/live-sessions/attendance
- POST /api/student/live-sessions/:id/attendance
- PATCH /api/student/live-sessions/:id/attendance

### Recordings
- GET /api/student/live-sessions/recordings
- GET /api/student/live-sessions/recordings/:id

### Participants
- GET /api/student/live-sessions/:id/participants
- POST /api/student/live-sessions/:id/participants
- DELETE /api/student/live-sessions/:id/participants/:participantId

### Schedules
- GET /api/student/live-sessions/schedules
- GET /api/student/live-sessions/upcoming

## Sample Payloads

### Attendance
{
  "status": "Present"
}

### Participant
{
  "studentId": 101
}

---

# ?? API Documentation — Module 6: Training Coordination

**Base URL:** `http://localhost:5000/api/v1/company/training`  
**Auth:** All endpoints require `Authorization: Bearer <JWT_TOKEN>` header

---

## ?? Authentication

All endpoints are protected by JWT authentication.  
JWT token is obtained from the `/api/v1/auth/login` endpoint.

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 401 | "Invalid or expired JWT token" |
| 403 | "Access denied. Insufficient permissions." |

---

## ?? Endpoints

---

### 1. GET `/api/v1/company/training`

**Description:** List all training programs for the authenticated company.  
**Auth Required:** ? Yes  
**Target Response Time:** < 500ms

**Query Parameters:**

| Parameter | Type   | Required | Default | Description            |
|-----------|--------|----------|---------|------------------------|
| status    | string | No       | —       | Filter by status: `ACTIVE`, `COMPLETED`, `PAUSED`, `CANCELLED` |
| limit     | number | No       | 10      | Max results per page   |
| offset    | number | No       | 0       | Number of results to skip |

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/company/training?status=ACTIVE&limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "trainingId": "T101",
      "title": "React Bootcamp",
      "status": "ACTIVE",
      "mentorAssigned": true,
      "mentor": {
        "mentorId": 1,
        "name": "John Doe",
        "email": "mentor@example.com"
      },
      "candidatesEnrolled": 1,
      "startDate": "2026-05-15T00:00:00.000Z",
      "endDate": "2026-06-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 10,
    "offset": 0
  }
}
```

**Error Responses:**
| Status | Description |
|--------|-------------|
| 401 | Invalid/missing JWT token |
| 500 | Internal server error |

---

### 2. GET `/api/v1/company/training/:id`

**Description:** Get detailed information for a specific training program.  
**Auth Required:** ? Yes  
**Target Response Time:** < 300ms

**Path Parameters:**

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| id        | string | Yes      | Training ID (e.g. T101) |

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/company/training/T101" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainingId": "T101",
    "title": "React Bootcamp",
    "description": "Complete React training covering fundamentals, hooks, and context API",
    "duration": 30,
    "startDate": "2026-05-15T00:00:00.000Z",
    "endDate": "2026-06-15T00:00:00.000Z",
    "status": "ACTIVE",
    "curriculum": ["React Basics", "Components & Props", "State & Lifecycle", "Hooks", "Context API"],
    "mentor": {
      "mentorId": 1,
      "name": "John Doe",
      "email": "mentor@example.com"
    },
    "enrolledCandidates": 1
  }
}
```

**Error Responses:**
| Status | Description |
|--------|-------------|
| 401 | Invalid/missing JWT token |
| 404 | Training not found or does not belong to company |
| 500 | Internal server error |

---

### 3. PATCH `/api/v1/company/training/:id/assign-mentor`

**Description:** Assign a mentor to a training program.  
**Auth Required:** ? Yes  
**Target Response Time:** < 400ms

**Path Parameters:**

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| id        | string | Yes      | Training ID (e.g. T101) |

**Request Body:**
```json
{
  "mentorId": "1"
}
```

| Field    | Type           | Required | Description         |
|----------|----------------|----------|---------------------|
| mentorId | string/number  | Yes      | ID of the mentor to assign |

**Example Request:**
```bash
curl -X PATCH "http://localhost:5000/api/v1/company/training/T101/assign-mentor" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mentorId": "1"}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Mentor assigned successfully"
}
```

**Error Responses:**
| Status | Description |
|--------|-------------|
| 400 | `mentorId` is required or invalid |
| 401 | Invalid/missing JWT token |
| 404 | Mentor not found or Training not found |
| 500 | Internal server error |

---

### 4. GET `/api/v1/company/training/:id/progress`

**Description:** Get comprehensive analytics and progress data for a training program.  
**Auth Required:** ? Yes  
**Target Response Time:** < 600ms

**Path Parameters:**

| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| id        | string | Yes      | Training ID (e.g. T101) |

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/company/training/T101/progress" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainingId": "T101",
    "title": "React Bootcamp",
    "totalCandidates": 1,
    "completionPercentage": 0,
    "attendanceRate": 100,
    "assignmentSubmissions": {
      "submitted": 0,
      "pending": 0
    }
  }
}
```

**Error Responses:**
| Status | Description |
|--------|-------------|
| 401 | Invalid/missing JWT token |
| 404 | Training not found or does not belong to company |
| 500 | Internal server error |

---

## ?? Quick Test Reference

```bash
# Get auth token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"company@example.com","password":"password123"}' \
  | jq -r '.token')

# 1. List trainings
curl -s http://localhost:5000/api/v1/company/training \
  -H "Authorization: Bearer $TOKEN" | jq .

# 2. Get training by ID
curl -s http://localhost:5000/api/v1/company/training/T101 \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Assign mentor
curl -s -X PATCH http://localhost:5000/api/v1/company/training/T101/assign-mentor \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mentorId":"1"}' | jq .

# 4. Get progress analytics
curl -s http://localhost:5000/api/v1/company/training/T101/progress \
  -H "Authorization: Bearer $TOKEN" | jq .
```
