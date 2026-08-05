-- Migration: Add modern SaaS fields to announcements table
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  ADD COLUMN IF NOT EXISTS target_audience VARCHAR(100) DEFAULT 'All Students',
  ADD COLUMN IF NOT EXISTS announcement_type VARCHAR(50) DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'Public' CHECK (visibility IN ('Public', 'Internal', 'Restricted')),
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS published_date TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS published_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS attachment_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT NULL;

-- Align existing published items' publish dates
UPDATE announcements 
SET published_date = created_at 
WHERE status = 'Published' AND published_date IS NULL;