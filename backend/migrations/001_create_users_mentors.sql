-- TABLE 1: auth_users (login credentials)
CREATE TABLE IF NOT EXISTS auth_users (
  id                  SERIAL PRIMARY KEY,
  uuid_id             UUID DEFAULT gen_random_uuid() UNIQUE,
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,
  role                VARCHAR(20) NOT NULL
                      CHECK (role IN ('mentor','student','company','admin','college')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 2: users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(255),
  auth_user_id  BIGINT UNIQUE NOT NULL
                REFERENCES auth_users(id)
                ON DELETE CASCADE,
  email         VARCHAR(255) UNIQUE NOT NULL,
  role          VARCHAR(20) NOT NULL
                CHECK (role IN ('mentor','student','company','admin','college')),
  username      VARCHAR(100),
  phone         VARCHAR(20),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE 3: mentors
CREATE TABLE IF NOT EXISTS mentors (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id),
  bio               TEXT,
  expertise_tags    TEXT[],
  avatar_url        VARCHAR(500),
  availability_json JSONB,
  verified          BOOLEAN NOT NULL DEFAULT false,
  status            VARCHAR(50) NOT NULL DEFAULT 'pending'
);

-- TABLE 4: drives
CREATE TABLE IF NOT EXISTS drives (
  id                SERIAL PRIMARY KEY,
  mentor_id         INTEGER NOT NULL REFERENCES mentors(id),
  company_id        INTEGER,
  title             VARCHAR(500) NOT NULL,
  status            VARCHAR(50) NOT NULL DEFAULT 'active'
);

-- INDEX: fast tag search
CREATE INDEX IF NOT EXISTS idx_mentors_expertise
ON mentors USING GIN(expertise_tags);
