/**
 * Database Connection Pool - Optimized
 *
 * Manages PostgreSQL connections for the API with improved stability:
 * - Longer connection timeout to handle high latency
 * - Retry logic for transient connection failures
 * - Health checks and auto-recovery
 * - Connection pool monitoring
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const CONNECTION_TIMEOUT_MS = 10000; // Increased from 2s to 10s
const IDLE_TIMEOUT_MS = 30000;
const MAX_CONNECTIONS = 20;
const STATEMENT_TIMEOUT_MS = 30000; // 30 seconds default query timeout

// Parse DATABASE_URL and remove sslmode parameter to handle SSL ourselves
let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.includes('sslmode=')) {
  // Remove sslmode parameter from connection string
  connectionString = connectionString
    .replace(/[?&]sslmode=[^&]*/, '')
    .replace(/\?&/, '?')
    .replace(/\?$/, '');
}

// Create connection pool with SSL configuration and improved timeouts
const poolConfig = connectionString
  ? {
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false, // Accept self-signed certificates from DigitalOcean
      },
      max: MAX_CONNECTIONS,
      idleTimeoutMillis: IDLE_TIMEOUT_MS,
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MS, // Increased for high-latency connections
      statement_timeout: STATEMENT_TIMEOUT_MS, // Prevent runaway queries
      query_timeout: STATEMENT_TIMEOUT_MS,
      keepAlive: true, // Enable TCP keepalive
      keepAliveInitialDelayMillis: 10000,
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
      max: MAX_CONNECTIONS,
      idleTimeoutMillis: IDLE_TIMEOUT_MS,
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
      statement_timeout: STATEMENT_TIMEOUT_MS,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };

const pool = new Pool(poolConfig);

// Connection monitoring
let connectionCount = 0;
let errorCount = 0;

// Test connection on startup with retry
pool.on('connect', (client) => {
  connectionCount++;
  console.log(`✅ Database connected (${connectionCount} connections established)`);

  // Set default statement timeout for this connection
  client.query(`SET statement_timeout = ${STATEMENT_TIMEOUT_MS}`).catch((err) => {
    console.warn('Failed to set statement timeout:', err.message);
  });
});

pool.on('error', (err) => {
  errorCount++;
  console.error(`❌ Unexpected database error (${errorCount} errors):`, err.message);
  // Don't exit - let the server continue running
});

pool.on('remove', () => {
  connectionCount--;
  console.log(`ℹ️  Connection removed (${connectionCount} active connections)`);
});

// Initial connection test with retry logic
async function testConnection(retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('✅ Database connection pool initialized');
      console.log(`   PostgreSQL version: ${result.rows[0].pg_version.split(' ')[1]}`);
      console.log(`   Server time: ${result.rows[0].current_time}`);
      console.log(`   Pool config: max=${MAX_CONNECTIONS}, timeout=${CONNECTION_TIMEOUT_MS}ms`);
      return true;
    } catch (err) {
      console.error(
        `❌ Database connection test failed (attempt ${attempt}/${retries}):`,
        err.message
      );

      if (attempt < retries) {
        console.log(`   Retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt)); // Exponential backoff
      } else {
        console.error('❌ Database connection failed after all retries');
        console.error('   Server will continue but database operations will fail');
        return false;
      }
    }
  }
  return false;
}

// Run initial connection test
testConnection();

// Helper function to execute queries with retry logic
async function query(text, params, retries = 2) {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      // Check if it's a connection error that might benefit from retry
      const isRetriable =
        err.code === 'ECONNREFUSED' ||
        err.code === 'ENOTFOUND' ||
        err.code === 'ETIMEDOUT' ||
        err.message.includes('Connection terminated') ||
        err.message.includes('Connection timeout');

      if (isRetriable && attempt <= retries) {
        console.warn(`Query failed (attempt ${attempt}/${retries + 1}), retrying:`, err.message);
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        continue;
      }

      // Not retriable or out of retries
      throw err;
    }
  }
}

// Helper function to get a client from the pool (for transactions)
const getClient = async () => {
  try {
    return await pool.connect();
  } catch (err) {
    console.error('Failed to get database client:', err.message);
    throw err;
  }
};

// Health check function
async function healthCheck() {
  try {
    const result = await pool.query('SELECT 1 as healthy');
    return {
      healthy: result.rows[0].healthy === 1,
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingClients: pool.waitingCount,
    };
  } catch (err) {
    return {
      healthy: false,
      error: err.message,
    };
  }
}

// Graceful shutdown
async function closePool() {
  console.log('Closing database connection pool...');
  await pool.end();
  console.log('✅ Database pool closed');
}

// Handle process termination
process.on('SIGTERM', closePool);
process.on('SIGINT', closePool);

module.exports = {
  query,
  getClient,
  pool,
  healthCheck,
  closePool,
};
