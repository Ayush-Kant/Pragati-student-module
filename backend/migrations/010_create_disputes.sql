-- Migration: 010_create_disputes.sql
-- Module: Admin Dispute Resolution System
-- Assumes users, students, mentors, colleges, companies already exist.

-- =========================================
-- TABLE: disputes
-- =========================================
CREATE TABLE IF NOT EXISTS disputes (
  id SERIAL PRIMARY KEY,

  filed_by_id INTEGER NOT NULL,
  filed_by_role VARCHAR(50) NOT NULL,

  against_id INTEGER NOT NULL,
  against_role VARCHAR(50) NOT NULL,

  dispute_type VARCHAR(50) NOT NULL
  CHECK (
    dispute_type IN (
      'mentor',
      'fraud',
      'drive',
      'system'
    )
  ),

  description TEXT NOT NULL,

  evidence_files TEXT[],

  status VARCHAR(50) NOT NULL DEFAULT 'open'
  CHECK (
    status IN (
      'open',
      'in_review',
      'resolved',
      'escalated'
    )
  ),

  priority VARCHAR(20) NOT NULL DEFAULT 'medium'
  CHECK (
    priority IN (
      'low',
      'medium',
      'high',
      'urgent'
    )
  ),

  resolution TEXT,

  reviewed_by INTEGER REFERENCES users(id),
  resolved_by INTEGER REFERENCES users(id),
  escalated_by INTEGER REFERENCES users(id),

  review_started_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- TABLE: dispute_notes
-- =========================================
CREATE TABLE IF NOT EXISTS dispute_notes (
  id SERIAL PRIMARY KEY,

  dispute_id INTEGER NOT NULL
    REFERENCES disputes(id)
    ON DELETE CASCADE,

  note TEXT NOT NULL,

  added_by INTEGER
    REFERENCES users(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX IF NOT EXISTS idx_disputes_status
ON disputes(status);

CREATE INDEX IF NOT EXISTS idx_disputes_priority
ON disputes(priority);

CREATE INDEX IF NOT EXISTS idx_disputes_type
ON disputes(dispute_type);

CREATE INDEX IF NOT EXISTS idx_dispute_notes_dispute
ON dispute_notes(dispute_id);