-- 1. Create Placement Drives Table
CREATE TABLE IF NOT EXISTS placement_drives (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    package VARCHAR(50),
    drive_date DATE NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Upcoming', 'Open', 'Closed', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for searching and filtering
CREATE INDEX IF NOT EXISTS idx_placement_drives_company ON placement_drives(company);
CREATE INDEX IF NOT EXISTS idx_placement_drives_status ON placement_drives(status);

-- 2. Create Drive Eligibility Table
CREATE TABLE IF NOT EXISTS drive_eligibility (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL,
    cgpa_cutoff DECIMAL(4, 2) CHECK (cgpa_cutoff >= 0 AND cgpa_cutoff <= 10),
    allowed_branches VARCHAR(255)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_drive_eligibility
        FOREIGN KEY(drive_id) 
        REFERENCES placement_drives(id) 
        ON DELETE CASCADE
);

-- 3. Create Drive Schedule Table
CREATE TABLE IF NOT EXISTS drive_schedule (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL UNIQUE,
    timeline_events JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_drive_schedule
        FOREIGN KEY(drive_id) 
        REFERENCES placement_drives(id) 
        ON DELETE CASCADE
);

-- 4. Create Interview Rounds Table
CREATE TABLE IF NOT EXISTS interview_rounds (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL,
    round_name VARCHAR(255) NOT NULL,
    description TEXT,
    round_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interview_rounds
        FOREIGN KEY(drive_id) 
        REFERENCES placement_drives(id) 
        ON DELETE CASCADE
);

-- 5. Create Drive Statistics Table
CREATE TABLE IF NOT EXISTS drive_statistics (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL UNIQUE,
    total_applied INTEGER DEFAULT 0,
    total_selected INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_drive_statistics
        FOREIGN KEY(drive_id) 
        REFERENCES placement_drives(id) 
        ON DELETE CASCADE
);

-- ----------------------------------------------------
-- SEED DATA
-- ----------------------------------------------------
DO $$ 
DECLARE 
    drive1_id INTEGER;
    drive2_id INTEGER;
BEGIN
    -- Only seed if the table is empty
    IF NOT EXISTS (SELECT 1 FROM placement_drives LIMIT 1) THEN
        
        -- Insert Drive 1
        INSERT INTO placement_drives (company, role, package, drive_date, deadline, status)
        VALUES ('Google', 'Software Engineer', '32 LPA', '2026-10-15', '2026-10-10', 'Upcoming')
        RETURNING id INTO drive1_id;

        INSERT INTO drive_eligibility (drive_id, cgpa_cutoff, allowed_branches)
        VALUES (drive1_id, 7.5, ARRAY['CSE', 'IT', 'ECE']);

        INSERT INTO drive_statistics (drive_id, total_applied, total_selected)
        VALUES (drive1_id, 0, 0);

        INSERT INTO drive_schedule (drive_id, timeline_events)
        VALUES (drive1_id, '[{"event": "Pre-Placement Talk", "date": "2026-10-15"}, {"event": "Online Assessment", "date": "2026-10-15"}]'::jsonb);

        -- Insert Drive 2
        INSERT INTO placement_drives (company, role, package, drive_date, deadline, status)
        VALUES ('Microsoft', 'SDE', '28 LPA', '2026-10-20', '2026-10-15', 'Open')
        RETURNING id INTO drive2_id;

        INSERT INTO drive_eligibility (drive_id, cgpa_cutoff, allowed_branches)
        VALUES (drive2_id, 7.5, ARRAY['CSE', 'IT', 'ECE']);

        INSERT INTO drive_statistics (drive_id, total_applied, total_selected)
        VALUES (drive2_id, 0, 0);

        INSERT INTO drive_schedule (drive_id, timeline_events)
        VALUES (drive2_id, '[{"event": "Pre-Placement Talk", "date": "2026-10-20"}, {"event": "Online Assessment", "date": "2026-10-20"}]'::jsonb);
        
    END IF;
END $$;
