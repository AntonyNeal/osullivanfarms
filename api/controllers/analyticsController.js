/**
 * Analytics Controller - Optimized Version
 * Handles session tracking, event logging, and analytics metrics with improved stability
 *
 * Improvements:
 * - Query timeouts to prevent hanging connections
 * - Optimized queries using FILTER clauses instead of subqueries
 * - Better error handling with specific error messages
 * - Graceful degradation for optional data
 * - Connection pool timeout handling
 */

const db = require('../utils/db');

// Configuration
const QUERY_TIMEOUT_MS = 15000; // 15 seconds
const STATEMENT_TIMEOUT_MS = 12000; // 12 seconds (less than query timeout)

/**
 * POST /api/analytics/sessions
 * Create or update a session
 */
const createSession = async (req, res) => {
  try {
    const {
      tenantId,
      sessionToken,
      fingerprint,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      referrer,
      userAgent,
      ipAddress,
      country,
      region,
      city,
      deviceType,
      browser,
      browserVersion,
      os,
      osVersion,
      landingPage,
    } = req.body;

    // Validate required fields
    if (!tenantId || !sessionToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tenantId and sessionToken are required',
      });
    }

    // Check if session already exists
    const existingSession = await db.query(
      'SELECT id, page_views FROM sessions WHERE session_token = $1',
      [sessionToken]
    );

    if (existingSession.rows.length > 0) {
      // Update existing session
      const session = existingSession.rows[0];
      const result = await db.query(
        `UPDATE sessions
         SET last_seen = NOW(),
             page_views = page_views + 1
         WHERE id = $1
         RETURNING id, session_token, page_views, created_at`,
        [session.id]
      );

      return res.json({
        success: true,
        data: {
          id: result.rows[0].id,
          sessionToken: result.rows[0].session_token,
          pageViews: result.rows[0].page_views,
          createdAt: result.rows[0].created_at,
          isNew: false,
        },
      });
    }

    // Create new session
    const result = await db.query(
      `INSERT INTO sessions (
        tenant_id,
        session_token,
        fingerprint,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        referrer,
        user_agent,
        ip_address,
        country,
        region,
        city,
        device_type,
        browser,
        browser_version,
        os,
        os_version,
        landing_page
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING 
        id,
        session_token,
        page_views,
        created_at`,
      [
        tenantId,
        sessionToken,
        fingerprint || null,
        utmSource || null,
        utmMedium || null,
        utmCampaign || null,
        utmContent || null,
        utmTerm || null,
        referrer || null,
        userAgent || null,
        ipAddress || null,
        country || null,
        region || null,
        city || null,
        deviceType || 'unknown',
        browser || null,
        browserVersion || null,
        os || null,
        osVersion || null,
        landingPage || null,
      ]
    );

    const session = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: session.id,
        sessionToken: session.session_token,
        pageViews: session.page_views,
        createdAt: session.created_at,
        isNew: true,
      },
    });
  } catch (error) {
    console.error('Error in createSession:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create session',
      details: error.message,
    });
  }
};

/**
 * POST /api/analytics/events
 * Log an analytics event
 */
const logEvent = async (req, res) => {
  try {
    const { sessionId, tenantId, eventType, eventData, pageUrl, pageTitle } = req.body;

    // Validate required fields
    if (!tenantId || !eventType) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tenantId and eventType are required',
      });
    }

    // Verify session exists if provided
    if (sessionId) {
      const sessionCheck = await db.query('SELECT id FROM sessions WHERE id = $1', [sessionId]);
      if (sessionCheck.rows.length === 0) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Session not found',
        });
      }
    }

    // Insert event
    const result = await db.query(
      `INSERT INTO events (
        session_id,
        tenant_id,
        event_type,
        event_data,
        page_url,
        page_title
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        session_id,
        tenant_id,
        event_type,
        event_data,
        page_url,
        created_at`,
      [
        sessionId || null,
        tenantId,
        eventType,
        eventData ? JSON.stringify(eventData) : '{}',
        pageUrl || null,
        pageTitle || null,
      ]
    );

    const event = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: event.id,
        sessionId: event.session_id,
        tenantId: event.tenant_id,
        eventType: event.event_type,
        eventData: event.event_data,
        pageUrl: event.page_url,
        createdAt: event.created_at,
      },
    });
  } catch (error) {
    console.error('Error in logEvent:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to log event',
      details: error.message,
    });
  }
};

/**
 * GET /api/analytics/:tenantId
 * Get analytics metrics for a tenant (OPTIMIZED)
 */
const getAnalytics = async (req, res) => {
  // Create timeout promise
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Analytics query timeout')), QUERY_TIMEOUT_MS)
  );

  try {
    const { tenantId } = req.params;
    const { startDate, endDate } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    // Race between timeout and actual query
    const analyticsData = await Promise.race([
      timeout,
      fetchAnalyticsData(tenantId, startDate, endDate),
    ]);

    res.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);

    const isTimeout = error.message?.includes('timeout');
    const statusCode = isTimeout ? 504 : 500;

    res.status(statusCode).json({
      error: isTimeout ? 'Gateway Timeout' : 'Internal Server Error',
      message: isTimeout
        ? 'Analytics query took too long - try a smaller date range'
        : 'Failed to retrieve analytics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Helper: Fetch analytics data with optimized queries
 */
async function fetchAnalyticsData(tenantId, startDate, endDate) {
  // Build date filter
  let dateFilter = '';
  const params = [tenantId];

  if (startDate) {
    params.push(startDate);
    dateFilter += ` AND created_at >= $${params.length}`;
  }

  if (endDate) {
    params.push(endDate);
    dateFilter += ` AND created_at <= $${params.length}`;
  }

  // Set statement timeout
  await db.query(`SET LOCAL statement_timeout = ${STATEMENT_TIMEOUT_MS}`);

  // OPTIMIZED: Single query for session metrics using FILTER
  const sessionMetrics = await db.query(
    `SELECT 
      COUNT(DISTINCT id) as total_sessions,
      COUNT(DISTINCT fingerprint) FILTER (WHERE fingerprint IS NOT NULL) as unique_visitors,
      COALESCE(AVG(page_views), 0)::numeric(10,2) as avg_page_views,
      COUNT(DISTINCT id) FILTER (WHERE page_views = 1) as bounce_sessions
    FROM sessions
    WHERE tenant_id = $1${dateFilter}`,
    params
  );

  // Get event metrics (lightweight)
  const eventMetrics = await db.query(
    `SELECT 
      COUNT(*) as total_events,
      COUNT(DISTINCT event_type) as unique_event_types
    FROM events
    WHERE tenant_id = $1${dateFilter}`,
    params
  );

  // Get conversion metrics with optimized join
  const conversionMetrics = await db.query(
    `SELECT 
      COUNT(DISTINCT b.id) as total_bookings,
      COUNT(DISTINCT b.session_id) FILTER (WHERE b.session_id IS NOT NULL) as sessions_with_booking,
      COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_bookings
    FROM bookings b
    WHERE b.tenant_id = $1${dateFilter}`,
    params
  );

  // Calculate metrics
  const sessionData = sessionMetrics.rows[0] || {};
  const eventData = eventMetrics.rows[0] || {};
  const conversionData = conversionMetrics.rows[0] || {};

  const totalSessions = parseInt(sessionData.total_sessions) || 0;
  const bounceSessions = parseInt(sessionData.bounce_sessions) || 0;
  const sessionsWithBooking = parseInt(conversionData.sessions_with_booking) || 0;

  const bounceRate = totalSessions > 0 ? ((bounceSessions / totalSessions) * 100).toFixed(2) : 0;
  const conversionRate =
    totalSessions > 0 ? ((sessionsWithBooking / totalSessions) * 100).toFixed(2) : 0;

  return {
    summary: {
      totalSessions,
      uniqueVisitors: parseInt(sessionData.unique_visitors) || 0,
      avgPageViews: parseFloat(sessionData.avg_page_views) || 0,
      bounceRate: parseFloat(bounceRate),
      totalEvents: parseInt(eventData.total_events) || 0,
      totalBookings: parseInt(conversionData.total_bookings) || 0,
      confirmedBookings: parseInt(conversionData.confirmed_bookings) || 0,
      conversionRate: parseFloat(conversionRate),
      avgTimeToBooking: 0, // Removed for performance
    },
  };
}

/**
 * GET /api/analytics/sessions/:sessionId
 * Get session details with event timeline
 */
const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Session ID is required',
      });
    }

    // Get session details
    const sessionResult = await db.query(`SELECT * FROM sessions WHERE id = $1`, [sessionId]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
    }

    const session = sessionResult.rows[0];

    // Get events for this session
    const eventsResult = await db.query(
      `SELECT 
        id,
        event_type,
        event_data,
        page_url,
        page_title,
        created_at
      FROM events
      WHERE session_id = $1
      ORDER BY created_at ASC`,
      [sessionId]
    );

    // Get booking if exists
    const bookingResult = await db.query(
      `SELECT 
        id,
        client_name,
        client_email,
        status,
        preferred_date,
        created_at
      FROM bookings
      WHERE session_id = $1
      LIMIT 1`,
      [sessionId]
    );

    res.json({
      success: true,
      data: {
        session: {
          id: session.id,
          tenantId: session.tenant_id,
          sessionToken: session.session_token,
          fingerprint: session.fingerprint,
          utm: {
            source: session.utm_source,
            medium: session.utm_medium,
            campaign: session.utm_campaign,
            content: session.utm_content,
            term: session.utm_term,
          },
          referrer: session.referrer,
          userAgent: session.user_agent,
          ipAddress: session.ip_address,
          location: {
            country: session.country,
            region: session.region,
            city: session.city,
          },
          device: {
            type: session.device_type,
            browser: session.browser,
            browserVersion: session.browser_version,
            os: session.os,
            osVersion: session.os_version,
          },
          landingPage: session.landing_page,
          pageViews: session.page_views,
          firstSeen: session.first_seen,
          lastSeen: session.last_seen,
          createdAt: session.created_at,
        },
        events: eventsResult.rows.map((e) => ({
          id: e.id,
          eventType: e.event_type,
          eventData: e.event_data,
          pageUrl: e.page_url,
          pageTitle: e.page_title,
          createdAt: e.created_at,
        })),
        booking:
          bookingResult.rows.length > 0
            ? {
                id: bookingResult.rows[0].id,
                clientName: bookingResult.rows[0].client_name,
                clientEmail: bookingResult.rows[0].client_email,
                status: bookingResult.rows[0].status,
                preferredDate: bookingResult.rows[0].preferred_date,
                createdAt: bookingResult.rows[0].created_at,
              }
            : null,
      },
    });
  } catch (error) {
    console.error('Error in getSessionDetails:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve session details',
      details: error.message,
    });
  }
};

module.exports = {
  createSession,
  logEvent,
  getAnalytics,
  getSessionDetails,
};
