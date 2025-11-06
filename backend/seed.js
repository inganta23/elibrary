// seed.js
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function runSeed() {
  let pool;
  let client;

  try {
    console.log("🌱 Starting seed process...");

    // Create new pool for seeding
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    client = await pool.connect();

    // Check if admin user already exists
    const existingAdmin = await client.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@example.com"]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("✅ Admin user already exists. Skipping seed...");
      return;
    }

    console.log("👤 Creating sample users...");

    // Hash passwords
    const hashedPassword = await bcrypt.hash("Admin123", 10);

    // Insert users with explicit UUIDs for consistency
    const adminUserId = "11111111-1111-1111-1111-111111111111";
    const regularUserId = "22222222-2222-2222-2222-222222222222";

    await client.query(
      `INSERT INTO users (id, email, password, role) 
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
      [
        adminUserId,
        "admin@example.com",
        hashedPassword,
        "admin",
        regularUserId,
        "user@example.com",
        hashedPassword,
        "user",
      ]
    );
    console.log("✅ Sample users inserted with UUIDs");

    // Insert books
    console.log("📚 Creating sample books...");

    const bookIds = [
      "33333333-3333-3333-3333-333333333333",
      "44444444-4444-4444-4444-444444444444",
      "55555555-5555-5555-5555-555555555555",
    ];

    await client.query(
      `INSERT INTO books (id, title, description, image_url, uploaded_by) 
       VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10), ($11, $12, $13, $14, $15)`,
      [
        bookIds[0],
        "JavaScript: The Good Parts",
        "A classic book about JavaScript programming",
        "/uploads/js-book.jpg",
        adminUserId,

        bookIds[1],
        "Clean Code",
        "A handbook of agile software craftsmanship",
        "/uploads/clean-code.jpg",
        adminUserId,

        bookIds[2],
        "The Pragmatic Programmer",
        "Your journey to mastery",
        "/uploads/pragmatic.jpg",
        adminUserId,
      ]
    );
    console.log("✅ Sample books inserted with UUIDs");

    // Insert some favorites
    console.log("❤️ Creating sample favorites...");
    await client.query(
      `INSERT INTO favorites (user_id, book_id) 
       VALUES ($1, $2), ($3, $4)`,
      [
        regularUserId,
        bookIds[0], // user favorites JavaScript book
        regularUserId,
        bookIds[1], // user favorites Clean Code book
      ]
    );
    console.log("✅ Sample favorites inserted");

    console.log("🎉 Seed data inserted successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  } finally {
    // Cleanup
    if (client) {
      await client.release();
    }
    if (pool) {
      await pool.end();
    }
    console.log("🔚 Seed process completed");
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };
