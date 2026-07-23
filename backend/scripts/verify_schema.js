import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:omkar1611@localhost:5432/pragati"
});

async function verifySchema() {
  try {
    console.log("Checking assessment tables...");
    
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'assessment%' 
      ORDER BY table_name
    `);
    
    console.log("Assessment Tables:");
    result.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
    
    // Check for all required columns in assessment_attempts
    console.log("\nChecking assessment_attempts table columns...");
    const columnsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'assessment_attempts'
      ORDER BY ordinal_position
    `);
    
    columnsResult.rows.forEach(row => {
      console.log(`  ✓ ${row.column_name}: ${row.data_type}`);
    });
    
    // Check for required indexes
    console.log("\nChecking assessment indexes...");
    const indexResult = await pool.query(`
      SELECT indexname FROM pg_indexes 
      WHERE tablename LIKE 'assessment%'
      ORDER BY indexname
    `);
    
    indexResult.rows.forEach(row => {
      console.log(`  ✓ ${row.indexname}`);
    });
    
    console.log("\n✅ Schema verification complete");
  } catch (error) {
    console.error("❌ Schema verification failed:", error.message);
  } finally {
    await pool.end();
  }
}

verifySchema();
