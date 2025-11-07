/**
 * Health Check Routes
 * 
 * Provides endpoints for monitoring system health:
 * - Database connectivity
 * - API status
 * - Cache statistics
 */

const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { cacheStatsHandler, cacheClearHandler } = require('../middleware/cache');

/**
 * GET /api/health
 * Basic health check - returns 200 if API is running
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * GET /api/health/database
 * Database connection health check
 */
router.get('/database', async (req, res) => {
  try {
    const health = await db.healthCheck();

    if (health.healthy) {
      res.json({
        status: 'healthy',
        database: 'connected',
        ...health,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        database: 'disconnected',
        ...health,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/health/cache
 * Cache statistics
 */
router.get('/cache', cacheStatsHandler);

/**
 * POST /api/health/cache/clear
 * Clear cache (admin only in production)
 */
router.post('/cache/clear', cacheClearHandler);

/**
 * GET /api/health/detailed
 * Comprehensive health check
 */
router.get('/detailed', async (req, res) => {
  try {
    const dbHealth = await db.healthCheck();
    const { cacheStatsHandler: getCacheStats } = require('../middleware/cache');
    
    // Get cache stats
    const mockReq = {};
    const mockRes = {
      json: (data) => data.data,
    };

    res.json({
      status: dbHealth.healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      components: {
        api: {
          status: 'healthy',
        },
        database: {
          status: dbHealth.healthy ? 'healthy' : 'unhealthy',
          ...dbHealth,
        },
        cache: {
          status: 'healthy',
          // Cache stats would go here
        },
      },
      system: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB',
        },
        node: {
          version: process.version,
        },
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
