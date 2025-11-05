/**
 * DigitalOcean Function: Register Session
 * Endpoint: POST /api/sessions/register
 *
 * Called from frontend on page load to create user_sessions record
 * with UTM attribution before booking form is opened
 */

const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function registerSession(req, res) {
  // CORS headers
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.ALLOWED_ORIGIN || 'https://clairehamilton.com.au'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.json({ error: 'Method not allowed' });
    return;
  }

  let client;
  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const {
      userId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      referrer,
      deviceType,
      userAgent,
    } = body;

    if (!userId) {
      res.statusCode = 400;
      res.json({ error: 'userId is required' });
      return;
    }

    client = await pool.connect();

    // Insert or update session
    const result = await client.query(
      `INSERT INTO user_sessions (
        user_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        referrer, device_type, user_agent, page_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)
      ON CONFLICT (user_id) DO UPDATE SET 
        session_end = NULL,
        page_count = page_count + 1,
        updated_at = NOW()
      RETURNING id, user_id, created_at`,
      [
        userId,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        referrer,
        deviceType,
        userAgent,
      ]
    );

    res.statusCode = 201;
    res.json({
      sessionId: result.rows[0].id,
      userId: result.rows[0].user_id,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    console.error('Error registering session:', error);
    res.statusCode = 500;
    res.json({
      error: 'Failed to register session',
      message: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = registerSession;
