-- Migration: 016_upgrade_companies_job_postings.sql
-- Adds missing columns to companies and job_postings tables
-- so the jobs model queries work correctly.

-- ============================================================
-- companies: add package column used by college jobs feature
-- ============================================================
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS package VARCHAR(100);

-- ============================================================
-- job_postings: add columns used by the jobs model
-- ============================================================
ALTER TABLE job_postings
  ADD COLUMN IF NOT EXISTS role              VARCHAR(255),
  ADD COLUMN IF NOT EXISTS department        VARCHAR(255),
  ADD COLUMN IF NOT EXISTS location          VARCHAR(255),
  ADD COLUMN IF NOT EXISTS package           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS cgpa_limit        NUMERIC(4,2),
  ADD COLUMN IF NOT EXISTS batch             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS application_deadline DATE,
  ADD COLUMN IF NOT EXISTS job_description   TEXT,
  ADD COLUMN IF NOT EXISTS hiring_process    TEXT,
  ADD COLUMN IF NOT EXISTS updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- title was created NOT NULL in 011 but the app uses `role` instead.
-- Drop the NOT NULL constraint so inserts that don't supply title still work.
ALTER TABLE job_postings
  ALTER COLUMN title DROP NOT NULL;

-- The original migration used posted_at; add created_at as an alias column
-- so the model's `jp.created_at` reference works.
ALTER TABLE job_postings
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Backfill created_at from posted_at for existing rows
UPDATE job_postings
  SET created_at = posted_at
  WHERE created_at IS NULL AND posted_at IS NOT NULL;

-- Backfill role from existing title where role is still null
UPDATE job_postings
  SET role = title
  WHERE role IS NULL AND title IS NOT NULL;
