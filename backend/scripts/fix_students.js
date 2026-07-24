import { pool } from './config/db.js';

async function fixTable() {
  try {
    await pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();');
    console.log('Successfully added updated_at to students table.');
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    process.exit(0);
  }
}

fixTable();
