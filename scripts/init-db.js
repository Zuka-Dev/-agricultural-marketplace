const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

// 🟢 REMOVE the SSL config entirely for local DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf-8"
  );
  try {
    await pool.query(schema);
    console.log("✅ Schema applied successfully.");
  } catch (err) {
    console.error("❌ Error applying schema:", err);
  } finally {
    await pool.end();
  }
}

run();
