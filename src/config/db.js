const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

const db = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
};

module.exports = db;