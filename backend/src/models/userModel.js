import { pool } from "../../config/db.js";

export const User = {
    async findById(id) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    },

    async findByAuthId(authUserId) {
        const result = await pool.query("SELECT * FROM users WHERE auth_user_id = $1", [authUserId]);
        return result.rows[0];
    },

    async create({ fullName, authUserId, email, role, username, phone }) {
        const result = await pool.query(
            `INSERT INTO users (full_name, auth_user_id, email, role, username, phone)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [fullName, authUserId, email, role, username, phone]
        );
        return result.rows[0];
    },

    async update(id, updates) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");
        
        const result = await pool.query(
            `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
            [id, ...values]
        );
        return result.rows[0];
    }
};
