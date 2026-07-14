-- Migration: 006_update_interviews_table.sql
-- Add missing fields for Interview Management to both legacy and v2 interview tables

-- Apply to legacy interviews table if it exists
ALTER TABLE IF EXISTS interviews
	ADD COLUMN IF NOT EXISTS interviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
	ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(500),
	ADD COLUMN IF NOT EXISTS result VARCHAR(50) DEFAULT 'PENDING' CHECK (result IN ('PASS', 'FAIL', 'PENDING')),
	ADD COLUMN IF NOT EXISTS attendance VARCHAR(50) DEFAULT 'pending' CHECK (attendance IN ('pending', 'present', 'absent'));

-- Also apply to the new interviews_v2 table if it exists
ALTER TABLE IF EXISTS interviews_v2
	ADD COLUMN IF NOT EXISTS interviewer_id UUID,
	ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(500),
	ADD COLUMN IF NOT EXISTS result VARCHAR(50) DEFAULT 'PENDING' CHECK (result IN ('PASS', 'FAIL', 'PENDING')),
	ADD COLUMN IF NOT EXISTS attendance VARCHAR(50) DEFAULT 'pending' CHECK (attendance IN ('pending', 'present', 'absent'));