import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../migrations/001_create_users_mentors.sql');
    let sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Prepend drops to ensure clean state
    const dropSql = `
      DROP TABLE IF EXISTS submissions CASCADE;
      DROP TABLE IF EXISTS student_progress CASCADE;
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS live_sessions CASCADE;
      DROP TABLE IF EXISTS recruitment_drives CASCADE;
      DROP TABLE IF EXISTS assessments CASCADE;
      DROP TABLE IF EXISTS courses CASCADE;
      DROP TABLE IF EXISTS drives CASCADE;
      DROP TABLE IF EXISTS mentors CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS auth_users CASCADE;
    `;
    
    console.log('Cleaning up old tables...');
    await pool.query(dropSql);

    console.log('Applying mentor profile migration...');
    await pool.query(sql);
    console.log('Migration applied successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();
