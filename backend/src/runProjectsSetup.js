// runProjectsSetup.js
import { up } from "./database/migrations/createProjectsTables.js";
import { seed } from "./seeders/projectSeedData.js";
import { pool } from "../config/db.js";

const run = async () => {
  try {
    // 1. Run migrations
    await up();
    
    // 2. Run seeders
    await seed();

    console.log("🚀 Projects Backend Module Setup successfully completed!");
  } catch (err) {
    console.error("❌ Projects Setup failed:", err.message);
  } finally {
    await pool.end();
  }
};

run();
