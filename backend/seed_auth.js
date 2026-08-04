import pg from "pg";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.POSTGRESQL_URI,
});

async function seed() {
  try {
    const email = "college@test.com";
    const password = "Password123";
    const role = "college";

    const existing = await pool.query(
      "SELECT * FROM auth_users WHERE email = $1",
      [email]
    );

    let userId;
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      const uuid = randomUUID();
      const authUser = await pool.query(
        "INSERT INTO auth_users (email, password_hash, role, uuid_id) VALUES ($1,$2,$3,$4) RETURNING id",
        [email, hash, role, uuid]
      );
      const authUserId = authUser.rows[0].id;
      const userRes = await pool.query(
        "INSERT INTO users (auth_user_id, email, role, username) VALUES ($1,$2,$3,$4) RETURNING id",
        [authUserId, email, role, "college_user"]
      );
      userId = userRes.rows[0].id;
      console.log("✅ Created test college account: college@test.com / Password123");
    } else {
      console.log("✅ Test college account already exists: college@test.com");
      const userRes = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id;
      }
    }

    if (userId) {
      const collegeProfile = await pool.query(
        "SELECT id FROM colleges WHERE user_id = $1",
        [userId]
      );
      if (collegeProfile.rows.length === 0) {
        await pool.query(
          "INSERT INTO colleges (name, user_id, email, status) VALUES ($1, $2, $3, $4)",
          ["Test College", userId, email, "approved"]
        );
        console.log("✅ Created test college profile for college@test.com");
      } else {
        console.log("✅ Test college profile already exists for college@test.com");
      }
    }
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await pool.end();
  }
}

seed();
