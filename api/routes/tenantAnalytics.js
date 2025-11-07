/**
 * Tenant Analytics Routes
 *
 * Routes for tenant performance and analytics views
 */

const express = require('express');
const router = express.Router();
const tenantAnalyticsController = require('../controllers/tenantAnalyticsController');

// GET /api/tenant-analytics/:tenantId/performance
router.get('/:tenantId/performance', tenantAnalyticsController.getPerformance);

// GET /api/tenant-analytics/:tenantId/traffic-sources
router.get('/:tenantId/traffic-sources', tenantAnalyticsController.getTrafficSources);

// GET /api/tenant-analytics/:tenantId/location-bookings
router.get('/:tenantId/location-bookings', tenantAnalyticsController.getLocationBookings);

// GET /api/tenant-analytics/:tenantId/availability-utilization
router.get(
  '/:tenantId/availability-utilization',
  tenantAnalyticsController.getAvailabilityUtilization
);

// GET /api/tenant-analytics/:tenantId/conversion-funnel
router.get('/:tenantId/conversion-funnel', tenantAnalyticsController.getConversionFunnel);

// GET /api/tenant-analytics/:tenantId/ab-test-results
router.get('/:tenantId/ab-test-results', tenantAnalyticsController.getABTestResults);

module.exports = router;
