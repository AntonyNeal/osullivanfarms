-- ============================================================================
-- ANALYTICS PERFORMANCE OPTIMIZATION MIGRATION
-- ============================================================================
-- This migration adds materialized views and indexes to improve analytics performance
-- Created: 2025-01-07
-- 
-- Features:
-- 1. Materialized view for daily analytics summary
-- 2. Indexes for faster analytics queries
-- 3. Function to refresh materialized views
-- 4. Scheduled refresh setup
-- ============================================================================

-- ============================================================================
-- MATERIALIZED VIEW: Daily Analytics Summary
-- ============================================================================
-- Pre-aggregates daily metrics to avoid expensive real-time calculations
-- Refresh: Once per day (recommended at midnight)

CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_summary AS
SELECT 
  s.tenant_id,
  DATE(s.created_at) as date,
  
  -- Session metrics
  COUNT(DISTINCT s.id) as total_sessions,
  COUNT(DISTINCT s.fingerprint) FILTER (WHERE s.fingerprint IS NOT NULL) as unique_visitors,
  AVG(s.page_views)::numeric(10,2) as avg_page_views,
  COUNT(DISTINCT s.id) FILTER (WHERE s.page_views = 1) as bounce_sessions,
  
  -- Device breakdown
  COUNT(DISTINCT s.id) FILTER (WHERE s.device_type = 'mobile') as mobile_sessions,
  COUNT(DISTINCT s.id) FILTER (WHERE s.device_type = 'desktop') as desktop_sessions,
  COUNT(DISTINCT s.id) FILTER (WHERE s.device_type = 'tablet') as tablet_sessions,
  
  -- UTM tracking
  COUNT(DISTINCT s.id) FILTER (WHERE s.utm_source IS NOT NULL) as sessions_with_utm,
  
  -- Geographic
  COUNT(DISTINCT s.country) as unique_countries,
  
  -- Event metrics
  (SELECT COUNT(*) FROM events e WHERE e.tenant_id = s.tenant_id AND DATE(e.created_at) = DATE(s.created_at)) as total_events,
  (SELECT COUNT(DISTINCT event_type) FROM events e WHERE e.tenant_id = s.tenant_id AND DATE(e.created_at) = DATE(s.created_at)) as unique_event_types,
  
  -- Booking metrics  
  (SELECT COUNT(*) FROM bookings b WHERE b.tenant_id = s.tenant_id AND DATE(b.created_at) = DATE(s.created_at)) as total_bookings,
  (SELECT COUNT(*) FROM bookings b WHERE b.tenant_id = s.tenant_id AND DATE(b.created_at) = DATE(s.created_at) AND b.status = 'confirmed') as confirmed_bookings,
  
  -- Conversion rate (calculated)
  CASE 
    WHEN COUNT(DISTINCT s.id) > 0 THEN 
      ((SELECT COUNT(DISTINCT b.session_id) FROM bookings b WHERE b.tenant_id = s.tenant_id AND DATE(b.created_at) = DATE(s.created_at) AND b.session_id IS NOT NULL)::numeric / COUNT(DISTINCT s.id)::numeric * 100)::numeric(10,2)
    ELSE 0
  END as conversion_rate,
  
  -- Bounce rate (calculated)
  CASE 
    WHEN COUNT(DISTINCT s.id) > 0 THEN
      (COUNT(DISTINCT s.id) FILTER (WHERE s.page_views = 1)::numeric / COUNT(DISTINCT s.id)::numeric * 100)::numeric(10,2)
    ELSE 0
  END as bounce_rate

FROM sessions s
GROUP BY s.tenant_id, DATE(s.created_at);

-- Index for fast tenant + date lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_daily_tenant_date 
ON analytics_daily_summary(tenant_id, date DESC);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date 
ON analytics_daily_summary(date DESC);

COMMENT ON MATERIALIZED VIEW analytics_daily_summary IS 'Pre-aggregated daily analytics metrics for faster reporting';

-- ============================================================================
-- ADDITIONAL INDEXES FOR ANALYTICS PERFORMANCE
-- ============================================================================

-- Session indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_sessions_tenant_created 
ON sessions(tenant_id, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '1 year';

CREATE INDEX IF NOT EXISTS idx_sessions_fingerprint_tenant 
ON sessions(fingerprint, tenant_id) 
WHERE fingerprint IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_utm_source_tenant 
ON sessions(utm_source, tenant_id) 
WHERE utm_source IS NOT NULL;

-- Event indexes for faster aggregation
CREATE INDEX IF NOT EXISTS idx_events_tenant_type_created 
ON events(tenant_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_session_created 
ON events(session_id, created_at DESC) 
WHERE session_id IS NOT NULL;

-- Booking indexes for conversion tracking
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_session 
ON bookings(tenant_id, session_id) 
WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_tenant_status_created 
ON bookings(tenant_id, status, created_at DESC);

-- ============================================================================
-- REFRESH FUNCTION
-- ============================================================================
-- Function to refresh the materialized view
-- Call this daily to update analytics data

CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Refresh materialized view concurrently (allows reads during refresh)
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_summary;
  
  -- Log refresh
  RAISE NOTICE 'Analytics summary refreshed at %', NOW();
END;
$$;

COMMENT ON FUNCTION refresh_analytics_summary() IS 'Refreshes analytics_daily_summary materialized view';

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

-- Manual refresh (run once after migration):
-- SELECT refresh_analytics_summary();

-- Query daily summary (much faster than real-time aggregation):
-- SELECT * FROM analytics_daily_summary 
-- WHERE tenant_id = 'your-tenant-id' 
--   AND date >= '2025-01-01' 
--   AND date <= '2025-12-31'
-- ORDER BY date DESC;

-- Get monthly totals:
-- SELECT 
--   tenant_id,
--   DATE_TRUNC('month', date) as month,
--   SUM(total_sessions) as monthly_sessions,
--   SUM(unique_visitors) as monthly_visitors,
--   SUM(total_bookings) as monthly_bookings,
--   AVG(conversion_rate) as avg_conversion_rate
-- FROM analytics_daily_summary
-- WHERE tenant_id = 'your-tenant-id'
-- GROUP BY tenant_id, DATE_TRUNC('month', date)
-- ORDER BY month DESC;

-- ============================================================================
-- SCHEDULED REFRESH (Optional - requires pg_cron extension)
-- ============================================================================
-- Uncomment if you have pg_cron extension installed:

-- Load extension:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily refresh at midnight:
-- SELECT cron.schedule(
--   'refresh-analytics-summary',
--   '0 0 * * *',  -- Daily at midnight
--   'SELECT refresh_analytics_summary();'
-- );

-- Alternative: Use application-level cron job or manual refresh
-- Example cron command:
-- 0 0 * * * psql $DATABASE_URL -c "SELECT refresh_analytics_summary();"

-- ============================================================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================================================

-- DROP MATERIALIZED VIEW IF EXISTS analytics_daily_summary CASCADE;
-- DROP FUNCTION IF EXISTS refresh_analytics_summary();
-- DROP INDEX IF EXISTS idx_sessions_tenant_created;
-- DROP INDEX IF EXISTS idx_sessions_fingerprint_tenant;
-- DROP INDEX IF EXISTS idx_sessions_utm_source_tenant;
-- DROP INDEX IF EXISTS idx_events_tenant_type_created;
-- DROP INDEX IF EXISTS idx_events_session_created;
-- DROP INDEX IF EXISTS idx_bookings_tenant_session;
-- DROP INDEX IF EXISTS idx_bookings_tenant_status_created;
