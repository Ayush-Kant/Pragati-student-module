import { pool } from "./config/db.js";

const alterTable = async () => {
    try {
        await pool.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS enrollment_no VARCHAR(50) UNIQUE,
            ADD COLUMN IF NOT EXISTS name VARCHAR(150),
            ADD COLUMN IF NOT EXISTS department VARCHAR(100),
            ADD COLUMN IF NOT EXISTS course VARCHAR(100),
            ADD COLUMN IF NOT EXISTS semester INT,
            ADD COLUMN IF NOT EXISTS cgpa NUMERIC(4,2),
            ADD COLUMN IF NOT EXISTS placement_status VARCHAR(50);
        `);
        console.log("✅ students table successfully altered with required columns.");
    } catch (e) {
        console.error("❌ Failed to alter table:", e);
    } finally {
        pool.end();
    }
}

alterTable();
