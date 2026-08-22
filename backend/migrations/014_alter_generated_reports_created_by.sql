-- ============================================================
-- Migration: 014_alter_generated_reports_created_by.sql
-- Fix created_by column type mismatch in generated_reports
-- ============================================================

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'generated_reports' 
          AND column_name = 'created_by' 
          AND data_type = 'character varying'
    ) THEN
        ALTER TABLE generated_reports 
        ALTER COLUMN created_by TYPE INTEGER USING (NULLIF(created_by, '')::INTEGER);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_generated_reports_created_by' 
          AND table_name = 'generated_reports'
    ) THEN
        ALTER TABLE generated_reports
        ADD CONSTRAINT fk_generated_reports_created_by
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END $$;
