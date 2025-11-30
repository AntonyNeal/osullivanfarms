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
  context.log('HTTP trigger function processed a request.');

  // Set CORS headers
  context.res = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    context.res.body = '';
    return;
  }

  // Get ID from route parameters
  const mobId = context.bindingData.id;

  try {
    // GET - either all mobs or single mob by ID
    if (req.method === 'GET') {
      if (mobId) {
        // GET single mob by ID
        const result = await pool.query('SELECT * FROM mob_kpi_summary WHERE mob_id = $1', [mobId]);

        if (result.rows.length === 0) {
          context.res.status = 404;
          context.res.body = {
            success: false,
            error: 'Mob not found',
          };
          return;
        }

        context.res.status = 200;
        context.res.body = {
          success: true,
          data: result.rows[0],
        };
        return;
      }

      // GET all mobs
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

    // PATCH update mob
    if (req.method === 'PATCH' && mobId) {
      const updates = req.body;

      // Build dynamic update query based on provided fields
      const allowedFields = [
        'mob_name',
        'breed_name',
        'status_name',
        'zone_name',
        'team_name',
        'current_location',
        'current_stage',
        'ewes_joined',
        'rams_in',
        'joining_date',
        'expected_lambing',
        'dry_off_date',
        'lamb_marking_date',
        'weaning_date',
      ];

      const setClause = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          setClause.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }

      if (setClause.length === 0) {
        context.res.status = 400;
        context.res.body = {
          success: false,
          error: 'No valid fields to update',
        };
        return;
      }

      values.push(mobId);
      const query = `UPDATE mobs SET ${setClause.join(', ')} WHERE mob_id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        context.res.status = 404;
        context.res.body = {
          success: false,
          error: 'Mob not found',
        };
        return;
      }

      context.res.status = 200;
      context.res.body = {
        success: true,
        data: result.rows[0],
        message: 'Mob updated successfully',
      };
      return;
    }

    // Method not allowed
    context.res.status = 405;
    context.res.body = {
      success: false,
      error: 'Method not allowed',
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
