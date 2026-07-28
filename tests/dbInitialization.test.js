const db = require('../src/config/db');

describe('database initialization', () => {
  it('creates the expected tables', async () => {
    const result = await db.query(`
      SELECT
        to_regclass('public.coding_challenges') AS coding_challenges,
        to_regclass('public.challenge_submissions') AS challenge_submissions,
        to_regclass('public.test_cases') AS test_cases,
        to_regclass('public.challenge_leaderboard') AS challenge_leaderboard
    `);

    const row = result.rows[0];

    expect(row.coding_challenges).toBe('coding_challenges');
    expect(row.challenge_submissions).toBe('challenge_submissions');
    expect(row.test_cases).toBe('test_cases');
    expect(row.challenge_leaderboard).toBe('challenge_leaderboard');
  });
});
