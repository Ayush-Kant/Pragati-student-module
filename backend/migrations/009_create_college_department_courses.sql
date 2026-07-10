-- ============================================================
-- College Module: Departments & Courses — Database Schema
-- Location: backend/migrations/college_departments_courses_schema.sql
--
-- Creates: departments, courses, department_courses,
-- department_statistics — with PKs, FKs, constraints, and indexes.
--
-- This file is self-contained (does not depend on any other table)
-- and can be run directly in pgAdmin 4's Query Tool, independent of
-- the scripts/migrate.js pipeline.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Table: departments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20)  NOT NULL,
    hod             VARCHAR(150),
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_departments_code UNIQUE (code),
    CONSTRAINT uq_departments_name UNIQUE (name),
    CONSTRAINT chk_departments_code_format CHECK (code ~ '^[A-Z0-9]{2,20}$')
);

CREATE INDEX IF NOT EXISTS idx_departments_name ON departments USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments (code);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments (is_active);

-- ------------------------------------------------------------
-- Table: courses
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS college_courses (
    id              SERIAL PRIMARY KEY,
    course_name     VARCHAR(150) NOT NULL,
    course_code     VARCHAR(20)  NOT NULL,
    semester        SMALLINT NOT NULL,
    credits         SMALLINT NOT NULL,
    department_id   INTEGER NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_college_courses_code UNIQUE (course_code),
    CONSTRAINT fk_courses_department
        FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_courses_semester CHECK (semester BETWEEN 1 AND 12),
    CONSTRAINT chk_courses_credits CHECK (credits BETWEEN 1 AND 10),
    CONSTRAINT chk_courses_code_format CHECK (course_code ~ '^[A-Z0-9]{3,20}$')
);

CREATE INDEX IF NOT EXISTS idx_college_courses_department_id ON college_courses (department_id);
CREATE INDEX IF NOT EXISTS idx_college_courses_semester ON college_courses (semester);
CREATE INDEX IF NOT EXISTS idx_college_courses_name ON college_courses USING GIN (to_tsvector('english', course_name));

-- ------------------------------------------------------------
-- Table: department_courses (junction table)
-- Supports courses shared/offered as electives across multiple
-- departments, while courses.department_id remains the "owning"
-- department.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS department_courses (
    id              SERIAL PRIMARY KEY,
    department_id   INTEGER NOT NULL,
    course_id       INTEGER NOT NULL,
    is_elective     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_department_course UNIQUE (department_id, course_id),
    CONSTRAINT fk_dc_department
        FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_dc_course
        FOREIGN KEY (course_id)
        REFERENCES college_courses (id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_department_courses_department_id ON department_courses (department_id);
CREATE INDEX IF NOT EXISTS idx_department_courses_course_id ON department_courses (course_id);

-- ------------------------------------------------------------
-- Table: department_statistics
-- Aggregated/denormalized stats per department for fast reads.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS department_statistics (
    id                  SERIAL PRIMARY KEY,
    department_id       INTEGER NOT NULL,
    total_courses       INTEGER NOT NULL DEFAULT 0,
    total_students       INTEGER NOT NULL DEFAULT 0,
    total_faculty       INTEGER NOT NULL DEFAULT 0,
    average_credits     NUMERIC(4,2) NOT NULL DEFAULT 0,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_department_statistics_department UNIQUE (department_id),
    CONSTRAINT fk_ds_department
        FOREIGN KEY (department_id)
        REFERENCES departments (id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_department_statistics_department_id ON department_statistics (department_id);

-- ------------------------------------------------------------
-- Trigger function: keep updated_at fresh on UPDATE
-- (CREATE OR REPLACE so it's safe even if another migration
-- already defined a function with this name)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_departments_updated_at ON departments;
CREATE TRIGGER trg_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_courses_updated_at ON college_courses;
CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON college_courses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();