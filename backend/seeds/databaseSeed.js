import { pool } from "../config/db.js";

const seedDatabase = async () => {
  try {
    console.log("⏳ Starting database schema initialization...");

    // 1. Create Placement Drives Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS placement_drives (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        package VARCHAR(50),
        location VARCHAR(255),
        hiring_process TEXT,
        drive_date DATE NOT NULL,
        deadline DATE NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Upcoming', 'Open', 'Closed', 'Completed', 'Cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for searching and filtering
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_placement_drives_company ON placement_drives(company);
      CREATE INDEX IF NOT EXISTS idx_placement_drives_status ON placement_drives(status);
    `);
    console.log("✅ placement_drives table created");

    // 2. Create Drive Eligibility Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drive_eligibility (
        id SERIAL PRIMARY KEY,
        drive_id INTEGER NOT NULL,
        cgpa_cutoff DECIMAL(4, 2) CHECK (cgpa_cutoff >= 0 AND cgpa_cutoff <= 10),
        allowed_branches VARCHAR(255)[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_drive_eligibility
          FOREIGN KEY(drive_id) 
          REFERENCES placement_drives(id) 
          ON DELETE CASCADE
      );
    `);
    console.log("✅ drive_eligibility table created");

    // 3. Create Drive Schedule Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drive_schedule (
        id SERIAL PRIMARY KEY,
        drive_id INTEGER NOT NULL UNIQUE,
        timeline_events JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_drive_schedule
          FOREIGN KEY(drive_id) 
          REFERENCES placement_drives(id) 
          ON DELETE CASCADE
      );
    `);
    console.log("✅ drive_schedule table created");

    // 4. Create Interview Rounds Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interview_rounds (
        id SERIAL PRIMARY KEY,
        drive_id INTEGER NOT NULL,
        round_name VARCHAR(255) NOT NULL,
        description TEXT,
        round_order INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_interview_rounds
          FOREIGN KEY(drive_id) 
          REFERENCES placement_drives(id) 
          ON DELETE CASCADE,
        CONSTRAINT unique_drive_round_order UNIQUE (drive_id, round_order)
      );
    `);
    console.log("✅ interview_rounds table created");

    // 5. Create Drive Statistics Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drive_statistics (
        id SERIAL PRIMARY KEY,
        drive_id INTEGER NOT NULL UNIQUE,
        total_applied INTEGER DEFAULT 0,
        total_selected INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_drive_statistics
          FOREIGN KEY(drive_id) 
          REFERENCES placement_drives(id) 
          ON DELETE CASCADE
      );
    `);
    console.log("✅ drive_statistics table created");

    // ----------------------------------------------------
    // SEED DATA
    // ----------------------------------------------------
    console.log("⏳ Seeding initial data...");

    const checkExisting = await pool.query(`SELECT COUNT(*) FROM placement_drives`);
    if (parseInt(checkExisting.rows[0].count) === 0) {
      const placementDriveSeedData = [
        { company: "Google", role: "Software Engineer", package: "32 LPA", location: "Bangalore", hiring_process: "Online Test -> Technical Interview -> HR", driveDate: "2026-10-15", deadline: "2026-10-10", status: "Upcoming" },
        { company: "Microsoft", role: "SDE", package: "28 LPA", location: "Hyderabad", hiring_process: "OA -> 3 Tech Rounds", driveDate: "2026-10-20", deadline: "2026-10-15", status: "Open" }
      ];

      for (const drive of placementDriveSeedData) {
        const result = await pool.query(`
          INSERT INTO placement_drives (company, role, package, location, hiring_process, drive_date, deadline, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        `, [drive.company, drive.role, drive.package, drive.location, drive.hiring_process, drive.driveDate, drive.deadline, drive.status]);
        
        const driveId = result.rows[0].id;

        // Seed Eligibility
        await pool.query(`
          INSERT INTO drive_eligibility (drive_id, cgpa_cutoff, allowed_branches)
          VALUES ($1, $2, $3)
        `, [driveId, 7.5, ['CSE', 'IT', 'ECE']]);

        // Seed Statistics
        await pool.query(`
          INSERT INTO drive_statistics (drive_id, total_applied, total_selected)
          VALUES ($1, $2, $3)
        `, [driveId, 0, 0]);

        // Seed Schedule
        await pool.query(`
          INSERT INTO drive_schedule (drive_id, timeline_events)
          VALUES ($1, $2)
        `, [driveId, JSON.stringify([
            { event: "Pre-Placement Talk", date: drive.driveDate },
            { event: "Online Assessment", date: drive.driveDate }
        ])]);
      }
      console.log("✅ Seed data inserted successfully");
    } else {
      console.log("⚠️ Data already exists, skipping seed.");
    }

    console.log("🎉 Database schema initialization and seeding complete!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
};

seedDatabase();
