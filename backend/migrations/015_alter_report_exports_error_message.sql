-- ============================================================
-- Migration: 015_alter_report_exports_error_message.sql
-- Add error_message column to report_exports
-- ============================================================

ALTER TABLE report_exports ADD COLUMN IF NOT EXISTS error_message TEXT;
