const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request.');

  // Set CORS headers
  context.res = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    context.res.body = '';
    return;
  }

  try {
    // GET all mobs
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM mob_kpi_summary ORDER BY last_updated DESC');
      
      context.res.status = 200;
      context.res.body = {
        success: true,
        data: result.rows,
        count: result.rows.length,
      };
      return;
    }

    // POST create new mob
    if (req.method === 'POST') {
      const {
        mob_name,
        breed_name,
        status_name,
        zone_name,
        team_name,
        current_stage,
        current_location,
        ewes_joined,
        rams_in,
        joining_date,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO mobs (
          mob_name, breed_name, status_name, zone_name, team_name,
          current_stage, current_location, ewes_joined, rams_in, joining_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          mob_name,
          breed_name,
          status_name,
          zone_name,
          team_name,
          current_stage || 'Pre-Joining',
          current_location,
          ewes_joined,
          rams_in,
          joining_date,
        ]
      );

      context.res.status = 201;
      context.res.body = {
        success: true,
        data: result.rows[0],
        message: 'Mob created successfully',
      };
      return;
    }

    // Method not allowed
    context.res.status = 405;
    context.res.body = {
      success: false,
      error: 'Method not allowed'
    };
  } catch (error) {
    context.log.error('Error:', error);
    context.res.status = 500;
    context.res.body = {
      success: false,
      error: 'Internal server error',
      message: error.message,
    };
  }
};
