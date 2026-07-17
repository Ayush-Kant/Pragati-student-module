CREATE TABLE IF NOT EXISTS student_badges (

    id SERIAL PRIMARY KEY,

    student_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    badge_id INTEGER NOT NULL
        REFERENCES badges(id)
        ON DELETE CASCADE,

    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(student_id, badge_id)

);

CREATE INDEX idx_student_badges_student_id
ON student_badges(student_id);
