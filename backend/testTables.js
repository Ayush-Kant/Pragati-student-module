import { pool } from "./config/db.js";
const test = async () => {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
        console.log("Tables:", res.rows.map(r => r.table_name));
    } catch (e) {
        console.error("DB Error:", e.message);
    } finally {
        pool.end();
    }
}
test();
