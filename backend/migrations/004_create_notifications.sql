CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,

  student_auth_user_id BIGINT NOT NULL
  REFERENCES auth_users(id)
  ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,

  message TEXT NOT NULL,

  type VARCHAR(50) NOT NULL,

  is_read BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);