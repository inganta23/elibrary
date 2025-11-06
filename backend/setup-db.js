// setup-db.js
const { Pool } = require("pg");
require("dotenv").config();

async function setupDatabase() {
  let mainClient;
  let dbClient;
  let dbPool;

  try {
    // Step 1: Connect to default postgres database to check/create our database
    const mainPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: "postgres",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    mainClient = await mainPool.connect();
    console.log("✅ Connected to PostgreSQL");

    // Check if database exists
    const dbCheck = await mainClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`📦 Creating database: ${process.env.DB_NAME}`);
      await mainClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log("✅ Database created successfully");
    } else {
      console.log(`📊 Database ${process.env.DB_NAME} already exists`);
    }

    // Release main client and close pool
    await mainClient.release();
    await mainPool.end();

    // Step 2: Connect to our target database and create tables
    dbPool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    dbClient = await dbPool.connect();
    console.log(`✅ Connected to database: ${process.env.DB_NAME}`);

    // Enable UUID extension
    await dbClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log("✅ UUID extension enabled");

    // Create tables with UUID
    await createTables(dbClient);

    console.log("🎉 Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    // Cleanup connections safely
    if (dbClient) {
      await dbClient.release();
    }
    if (dbPool) {
      await dbPool.end();
    }
  }
}

async function createTables(client) {
  try {
    // Users table with UUID
    const userTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);

    if (!userTableExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
        )
      `);
      console.log("✅ Users table created with UUID and updated_at");
    } else {
      console.log("✅ Users table already exists");
    }

    // Books table with UUID
    const bookTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'books'
      )
    `);

    if (!bookTableExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE books (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(255),
          uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 
        )
      `);
      console.log("✅ Books table created with UUID and updated_at");
    } else {
      console.log("✅ Books table already exists");
    }

    // Favorites table with UUID
    const favoriteTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'favorites'
      )
    `);

    if (!favoriteTableExists.rows[0].exists) {
      await client.query(`
        CREATE TABLE favorites (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          book_id UUID REFERENCES books(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
          UNIQUE(user_id, book_id)
        )
      `);
      console.log("✅ Favorites table created with UUID and updated_at");
    } else {
      console.log("✅ Favorites table already exists");
    }
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
