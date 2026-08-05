-- 021_update_interviews_table.sql
-- Add missing fields (application_id, scheduled_at, interview_type) to interviews table

ALTER TABLE interviews ADD COLUMN IF NOT EXISTS application_id INTEGER REFERENCES student_drive_progress(id) ON DELETE CASCADE;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interview_type VARCHAR(100);
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS feedback TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'scheduled';

-- Create offers table for company offer management
CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL REFERENCES recruitment_drives(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    offer_letter_number VARCHAR(100) UNIQUE NOT NULL,
    package VARCHAR(100) NOT NULL,
    joining_date DATE,
    offer_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (
        offer_status IN ('PENDING', 'SENT', 'ACCEPTED', 'DECLINED', 'REVOKED', 'EXPIRED')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (drive_id, student_id)
);
