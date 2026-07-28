const db = require('./db');
const codingChallengeSeedData = require('../../database/seeders/codingChallengeSeedData');

async function initializeDatabase() {
  const queries = [
    `
      CREATE TABLE IF NOT EXISTS coding_challenges (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(50) DEFAULT 'Easy',
        category VARCHAR(100),
        points INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS test_cases (
        id SERIAL PRIMARY KEY,
        challenge_id INTEGER NOT NULL REFERENCES coding_challenges(id) ON DELETE CASCADE,
        visibility VARCHAR(20) DEFAULT 'Public',
        input TEXT,
        expected_output TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS challenge_submissions (
        id SERIAL PRIMARY KEY,
        student_id INTEGER,
        challenge_id INTEGER REFERENCES coding_challenges(id) ON DELETE SET NULL,
        language VARCHAR(50),
        source_code TEXT,
        status VARCHAR(50) DEFAULT 'Submitted',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS challenge_leaderboard (
        id SERIAL PRIMARY KEY,
        student_id INTEGER UNIQUE,
        score INTEGER DEFAULT 0,
        rank INTEGER DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS execution_results (
        id SERIAL PRIMARY KEY,
        challenge_id INTEGER REFERENCES coding_challenges(id) ON DELETE CASCADE,
        student_id INTEGER,
        status VARCHAR(50) DEFAULT 'Completed',
        output TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `
  ];

  for (const query of queries) {
    await db.query(query);
  }

  const challengeCountResult = await db.query('SELECT COUNT(*)::int AS count FROM coding_challenges');
  const challengeCount = challengeCountResult.rows[0].count;

  if (challengeCount === 0) {
    for (const challenge of codingChallengeSeedData) {
      const insertedChallenge = await db.query(
        `
          INSERT INTO coding_challenges (title, description, difficulty, category, points)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `,
        [
          challenge.title,
          `${challenge.title} challenge description`,
          challenge.difficulty,
          challenge.category,
          challenge.points
        ]
      );

      const challengeId = insertedChallenge.rows[0].id;

      await db.query(
        `
          INSERT INTO test_cases (challenge_id, visibility, input, expected_output)
          VALUES ($1, 'Public', $2, $3)
        `,
        [challengeId, 'input', 'output']
      );

      await db.query(
        `
          INSERT INTO test_cases (challenge_id, visibility, input, expected_output)
          VALUES ($1, 'Hidden', $2, $3)
        `,
        [challengeId, 'hidden input', 'hidden output']
      );
    }
  }
}

module.exports = { initializeDatabase };