/**
 * Tenant Analytics Controller
 *
 * Exposes analytics views for public consumption (non-sensitive data only)
 */

const db = require('../utils/db');

/**
 * GET /api/tenant-analytics/:tenantId/performance
 * Get tenant performance summary (sessions, bookings, conversion rate)
 */
const getPerformance = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        tenant_id,
        tenant_name,
        subdomain,
        total_sessions,
        unique_visitors,
        total_bookings,
        conversion_rate,
        photo_clicks,
        form_starts,
        last_visit
      FROM v_tenant_performance
      WHERE tenant_id = $1`,
      [tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tenant not found',
      });
    }

    res.json({
      success: true,
      data: {
        tenantId: result.rows[0].tenant_id,
        tenantName: result.rows[0].tenant_name,
        subdomain: result.rows[0].subdomain,
        sessions: parseInt(result.rows[0].total_sessions),
        uniqueVisitors: parseInt(result.rows[0].unique_visitors),
        bookings: parseInt(result.rows[0].total_bookings),
        conversionRate: parseFloat(result.rows[0].conversion_rate),
        photoClicks: parseInt(result.rows[0].photo_clicks),
        formStarts: parseInt(result.rows[0].form_starts),
        lastVisit: result.rows[0].last_visit,
      },
    });
  } catch (error) {
    console.error('Error in getPerformance:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve performance data',
      details: error.message,
    });
  }
};

/**
 * GET /api/tenant-analytics/:tenantId/traffic-sources
 * Get traffic source breakdown (UTM tracking)
 */
const getTrafficSources = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        source,
        medium,
        sessions,
        unique_visitors,
        conversions
      FROM v_traffic_sources
      WHERE tenant_id = $1
      ORDER BY sessions DESC`,
      [tenantId]
    );

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        source: row.source,
        medium: row.medium,
        sessions: parseInt(row.sessions),
        uniqueVisitors: parseInt(row.unique_visitors),
        conversions: parseInt(row.conversions),
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getTrafficSources:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve traffic sources',
      details: error.message,
    });
  }
};

/**
 * GET /api/tenant-analytics/:tenantId/location-bookings
 * Get booking analytics by location
 */
const getLocationBookings = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        city,
        country,
        location_type,
        total_bookings,
        confirmed_bookings,
        completed_bookings,
        cancelled_bookings,
        avg_duration_hours,
        first_booking_date,
        last_booking_date
      FROM v_location_bookings
      WHERE tenant_id = $1
      ORDER BY total_bookings DESC`,
      [tenantId]
    );

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        city: row.city,
        country: row.country,
        locationType: row.location_type,
        totalBookings: parseInt(row.total_bookings),
        confirmedBookings: parseInt(row.confirmed_bookings),
        completedBookings: parseInt(row.completed_bookings),
        cancelledBookings: parseInt(row.cancelled_bookings),
        avgDurationHours: row.avg_duration_hours ? parseFloat(row.avg_duration_hours) : null,
        firstBookingDate: row.first_booking_date,
        lastBookingDate: row.last_booking_date,
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getLocationBookings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve location bookings',
      details: error.message,
    });
  }
};

/**
 * GET /api/tenant-analytics/:tenantId/availability-utilization
 * Get availability utilization rates
 */
const getAvailabilityUtilization = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { startDate, endDate } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    let query = `
      SELECT 
        date,
        city,
        country,
        total_slots,
        available_slots,
        booked_slots,
        blocked_slots,
        utilization_rate
      FROM v_availability_utilization
      WHERE tenant_id = $1
    `;

    const params = [tenantId];

    if (startDate) {
      params.push(startDate);
      query += ` AND date >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      query += ` AND date <= $${params.length}`;
    }

    query += ` ORDER BY date DESC`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        date: row.date,
        city: row.city,
        country: row.country,
        totalSlots: parseInt(row.total_slots),
        availableSlots: parseInt(row.available_slots),
        bookedSlots: parseInt(row.booked_slots),
        blockedSlots: parseInt(row.blocked_slots),
        utilizationRate: row.utilization_rate ? parseFloat(row.utilization_rate) : 0,
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getAvailabilityUtilization:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve availability utilization',
      details: error.message,
    });
  }
};

/**
 * GET /api/tenant-analytics/:tenantId/conversion-funnel
 * Get conversion funnel data
 */
const getConversionFunnel = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { startDate, endDate } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    // Set default date range if not provided (last 30 days)
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();

    const result = await db.query(
      `SELECT * FROM get_conversion_funnel($1::uuid, $2::timestamp, $3::timestamp)`,
      [tenantId, start, end]
    );

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        stage: row.stage,
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      })),
      dateRange: {
        startDate: start,
        endDate: end,
      },
    });
  } catch (error) {
    console.error('Error in getConversionFunnel:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve conversion funnel',
      details: error.message,
    });
  }
};

module.exports = {
  getPerformance,
  getTrafficSources,
  getLocationBookings,
  getAvailabilityUtilization,
  getConversionFunnel,
};
