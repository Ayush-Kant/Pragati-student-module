-- Migration: 006_update_interviews_table.sql
-- Add missing fields for Interview Management (interviewer_id, meeting_link, result, attendance)

CREATE TABLE IF NOT EXISTS interviews (id SERIAL PRIMARY KEY);

ALTER TABLE interviews
ADD COLUMN IF NOT EXISTS interviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS result VARCHAR(50) DEFAULT 'PENDING' CHECK (result IN ('PASS', 'FAIL', 'PENDING')),
ADD COLUMN IF NOT EXISTS attendance VARCHAR(50) DEFAULT 'pending' CHECK (attendance IN ('pending', 'present', 'absent'));
