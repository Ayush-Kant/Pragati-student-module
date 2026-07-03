import { pool } from "./config/db.js";
const check = async () => {
    try {
        const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'colleges';");
        console.log("colleges:", res.rows);
        const res2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'college_profiles';");
        console.log("college_profiles:", res2.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
check();
