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
