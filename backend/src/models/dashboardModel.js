import { pool } from "../../config/db.js";

export const Dashboard = {
    /**
     * Get overall dashboard stats
     * @returns {Object} Stats object
     */
    async getDashboardStats() {
        const result = await pool.query("SELECT * FROM dashboard_stats LIMIT 1");
        return result.rows[0];
    },

    /**
     * Get recent activities
     * @param {number} limit - Number of activities to fetch
     * @returns {Array} List of activities
     */
    async getDashboardActivities(limit = 10) {
        const result = await pool.query(
            `SELECT a.*, u.full_name as user_name 
             FROM dashboard_activities a
             LEFT JOIN users u ON a.user_id = u.id
             ORDER BY a.created_at DESC 
             LIMIT $1`,
            [limit]
        );
        return result.rows;
    },

    /**
     * Get placement analytics data
     * @returns {Object} Placement analytics
     */
    async getPlacementAnalytics() {
        const result = await pool.query(
            "SELECT report_data FROM dashboard_reports WHERE report_type = 'placement' ORDER BY generated_at DESC LIMIT 1"
        );
        return result.rows[0]?.report_data;
    },

    /**
     * Get revenue analytics data
     * @returns {Object} Revenue analytics
     */
    async getRevenueAnalytics() {
        const result = await pool.query(
            "SELECT report_data FROM dashboard_reports WHERE report_type = 'revenue' ORDER BY generated_at DESC LIMIT 1"
        );
        return result.rows[0]?.report_data;
    },

    /**
     * Get admissions analytics data
     * @returns {Object} Admissions analytics
     */
    async getAdmissionsAnalytics() {
        const result = await pool.query(
            "SELECT report_data FROM dashboard_reports WHERE report_type = 'admission' ORDER BY generated_at DESC LIMIT 1"
        );
        return result.rows[0]?.report_data;
    },

    /**
     * Create a new activity log entry
     */
    async logActivity({ userId, title, description, status }) {
        const result = await pool.query(
            `INSERT INTO dashboard_activities (user_id, title, description, status)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, title, description, status]
        );
        return result.rows[0];
    },

    /**
     * Update dashboard stats
     */
    async updateStats(stats) {
        const fields = Object.keys(stats);
        const values = Object.values(stats);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
        
        const result = await pool.query(
            `UPDATE dashboard_stats SET ${setClause}, last_updated = NOW() RETURNING *`,
            values
        );
        return result.rows[0];
    }
};
