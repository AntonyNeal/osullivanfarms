/**
 * Social Analytics Routes
 *
 * Routes for social media performance analytics
 */

const express = require('express');
const router = express.Router();
const socialAnalyticsController = require('../controllers/socialAnalyticsController');

// GET /api/social-analytics/:tenantId/post-performance
router.get('/:tenantId/post-performance', socialAnalyticsController.getPostPerformance);

// GET /api/social-analytics/:tenantId/platform-performance
router.get('/:tenantId/platform-performance', socialAnalyticsController.getPlatformPerformance);

// GET /api/social-analytics/:tenantId/top-posts
router.get('/:tenantId/top-posts', socialAnalyticsController.getTopPosts);

// GET /api/social-analytics/:tenantId/top-hashtags
router.get('/:tenantId/top-hashtags', socialAnalyticsController.getTopHashtags);

// GET /api/social-analytics/:tenantId/daily-metrics
router.get('/:tenantId/daily-metrics', socialAnalyticsController.getDailyMetrics);

// GET /api/social-analytics/:tenantId/follower-growth
router.get('/:tenantId/follower-growth', socialAnalyticsController.getFollowerGrowth);

module.exports = router;
