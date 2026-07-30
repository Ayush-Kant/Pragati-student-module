CREATE TABLE IF NOT EXISTS badges (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT,

    icon_url VARCHAR(255) NOT NULL,

    criteria_json JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);
