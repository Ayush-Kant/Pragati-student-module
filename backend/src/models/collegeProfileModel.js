import { pool } from "../../config/db.js";

export const CollegeProfile = {
    async findByUserId(userId) {
        const result = await pool.query(
            "SELECT * FROM college_profiles WHERE user_id = $1",
            [userId]
        );
        return result.rows[0];
    },

    async create(profileData) {
        const {
            userId, collegeName, collegeCode, address, website,
            contactNumber, establishedYear, accreditation
        } = profileData;

        const result = await pool.query(
            `INSERT INTO college_profiles (
                user_id, college_name, college_code, address, website,
                contact_number, established_year, accreditation
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                userId, collegeName, collegeCode, address, website,
                contactNumber, establishedYear, accreditation
            ]
        );
        return result.rows[0];
    },

    async updateByUserId(userId, updates) {
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");

        const result = await pool.query(
            `UPDATE college_profiles 
             SET ${setClause}, updated_at = NOW() 
             WHERE user_id = $1 
             RETURNING *`,
            [userId, ...values]
        );
        return result.rows[0];
    },

    async getAll() {
        // Optimized query with only necessary fields for listing
        const result = await pool.query(
            "SELECT id, college_name, college_code, website, accreditation FROM college_profiles ORDER BY college_name"
        );
        return result.rows;
    }
};
