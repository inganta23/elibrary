const { Pool } = require("pg");

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "elibrary",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  // Enhanced configuration for Docker
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 20,
  allowExitOnIdle: false,
  // Connection retry logic
  retryConnection: {
    maxRetries: 5,
    delay: 5000,
  },
};

const pool = new Pool(poolConfig);

// Enhanced connection handling with retries
const initializeDatabase = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log("✅ Database connection established successfully");

      // Test basic query
      await client.query("SELECT 1");
      client.release();

      return;
    } catch (error) {
      console.error(
        `❌ Database connection attempt ${attempt}/${retries} failed:`,
        error.message
      );

      if (attempt === retries) {
        console.error("💥 All database connection attempts failed. Exiting...");
        process.exit(1);
      }

      console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Event listeners for better monitoring
pool.on("connect", () => {
  console.log("🔗 New database connection established");
});

pool.on("remove", () => {
  console.log("🔌 Database connection removed");
});

pool.on("error", (err, client) => {
  console.error("💥 Unexpected error on idle database client:", err);
  // Don't exit process, let the pool handle reconnections
});

// Initialize database connection
initializeDatabase()
  .then(() => {
    console.log("🎉 Database layer initialized successfully");
  })
  .catch((error) => {
    console.error("💥 Database initialization failed:", error);
    process.exit(1);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool, // Export pool for direct access if needed
};
