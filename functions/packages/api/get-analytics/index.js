/**
 * DigitalOcean Function: Get Analytics
 * Endpoint: GET /api/analytics/bookings
 *
 * Returns aggregated booking data by platform, campaign, time period
 * Query params: startDate, endDate, groupBy (default: utm_source)
 */

const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function getAnalytics(req, res) {
  // CORS headers
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.ALLOWED_ORIGIN || 'https://clairehamilton.com.au'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.json({ error: 'Method not allowed' });
    return;
  }

  let client;
  try {
    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const groupBy = url.searchParams.get('groupBy') || 'utm_source';

    // Validate groupBy parameter (prevent SQL injection)
    const validGroupBy = ['utm_source', 'utm_medium', 'utm_campaign', 'appointment_type', 'gender'];
    if (!validGroupBy.includes(groupBy)) {
      res.statusCode = 400;
      res.json({ error: 'Invalid groupBy parameter' });
      return;
    }

    // Calculate date range (default: 30 days)
    const start =
      startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    client = await pool.connect();

    // Query aggregated data
    const result = await client.query(
      `SELECT 
        COALESCE(${groupBy}, 'Direct') as category,
        COUNT(DISTINCT user_sessions.id) as sessions,
        COUNT(DISTINCT bookings.id) as bookings,
        ROUND(100.0 * COUNT(DISTINCT bookings.id)::numeric / 
          NULLIF(COUNT(DISTINCT user_sessions.id), 0), 2) as conversion_rate,
        COUNT(DISTINCT bookings.id) FILTER (WHERE payment_status = 'paid') as paid_bookings
      FROM user_sessions
      LEFT JOIN bookings ON user_sessions.id = bookings.user_session_id
      WHERE user_sessions.session_start::date >= $1
        AND user_sessions.session_start::date <= $2
      GROUP BY ${groupBy}
      ORDER BY bookings DESC`,
      [start, end]
    );

    res.statusCode = 200;
    res.json({
      period: { startDate: start, endDate: end },
      groupBy,
      data: result.rows,
      totalSessions: result.rows.reduce((sum, row) => sum + parseInt(row.sessions || 0), 0),
      totalBookings: result.rows.reduce((sum, row) => sum + parseInt(row.bookings || 0), 0),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.statusCode = 500;
    res.json({
      error: 'Failed to fetch analytics',
      message: error.message,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = getAnalytics;
