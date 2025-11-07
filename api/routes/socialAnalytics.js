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

module.exports = router;
