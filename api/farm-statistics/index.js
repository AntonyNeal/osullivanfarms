const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

module.exports = async function (context, req) {
  context.log('Farm statistics function triggered');

  // Set CORS headers
  context.res = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    context.res.body = '';
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM farm_statistics');

    context.res.status = 200;
    context.res.body = {
      success: true,
      data: result.rows[0] || {},
    };
  } catch (error) {
    context.log.error('Error fetching farm statistics:', error);
    context.res.status = 500;
    context.res.body = {
      success: false,
      error: 'Failed to fetch farm statistics',
      message: error.message,
    };
  }
};
