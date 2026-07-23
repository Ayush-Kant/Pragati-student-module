-- =============================================================================
-- 000_schema_migrations.sql
--
-- Run this FIRST before all other migrations.
-- Creates the migration tracking table so a migration runner can record
-- which migrations have already been applied, making the process idempotent
-- and safe to re-run on any environment.
-- =============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  version    VARCHAR(100) PRIMARY KEY,
  applied_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for quick existence checks in the migration runner.
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at
  ON schema_migrations(applied_at DESC);
