// Azure Functions Handler for Express API (Static Web Apps compatible)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Define allowed patterns for your domains
      const allowedPatterns = [
        /^https?:\/\/([a-z0-9-]+\.)?azurestaticapps\.net$/, // Azure Static Web Apps
        /^https?:\/\/([a-z0-9-]+\.)?sheepsheet\.io$/, // Custom domain (sheepsheet.io, www.sheepsheet.io, dev.sheepsheet.io)
        /^https?:\/\/([a-z0-9-]+\.)?vercel\.app$/, // Vercel deployments
        /^https?:\/\/([a-z0-9-]+\.)?osullivanfarms\.tech$/, // Legacy custom domain
        /^http:\/\/localhost(:\d+)?$/, // localhost:*
        /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1:*
      ];

      // Check if origin matches any allowed pattern
      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS: Blocked origin ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  next();
});

// Import routes (commented out - using direct routes below for Azure Functions compatibility)
// The app.use() router mounting doesn't work properly in Azure Functions wrapper
// try {
//   const bookingRoutes = require('./routes/bookings');
//   const paymentRoutes = require('./routes/payments');
//   const mobRoutes = require('./routes/mobs');
//
//   console.log('Routes loaded successfully');
//
//   // Routes - no /api prefix as Azure Functions adds it
//   app.use('/bookings', bookingRoutes);
//   app.use('/payments', paymentRoutes);
//   app.use('/mobs', mobRoutes);
//
//   console.log('All routes mounted');
// } catch (error) {
//   console.error('Error loading routes:', error);
//   console.error('Stack:', error.stack);
// }

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Test direct mob route
app.get('/mobs-test', (req, res) => {
  res.json({ message: 'Direct route test works!', timestamp: new Date().toISOString() });
});

// Database connection
const db = require('./db');

// Direct mobs routes with database integration
app.get('/mobs', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM mob_kpi_summary ORDER BY last_updated DESC LIMIT 100'
    );
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching mobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mobs',
      message: error.message,
    });
  }
});

app.get('/farm-statistics', async (req, res) => {
  try {
    // Query farm_statistics view or calculate from mobs
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_mobs,
        SUM(ewes_joined) as total_ewes,
        AVG(scanning_percent) as avg_scanning_percent,
        AVG(marking_percent) as avg_marking_percent,
        AVG(weaning_percent) as avg_weaning_percent
      FROM mobs
      WHERE is_active = TRUE
    `);

    res.json({
      success: true,
      data: result.rows[0] || {
        total_mobs: 0,
        total_ewes: 0,
        avg_scanning_percent: 0,
        avg_marking_percent: 0,
        avg_weaning_percent: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching farm statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farm statistics',
      message: error.message,
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "O'Sullivan Farms API",
    version: '1.0.0',
    endpoints: ['/health', '/mobs', '/farm-statistics', '/farm-advisor'],
  });
});

// Test services endpoint
// app.get('/test-services', testServices); // TEMP: Commented out - service causing startup crash

// Farm Advisor endpoints
app.post('/farm-advisor', async (req, res) => {
  console.log('[DEBUG] Farm advisor route hit!');
  console.log('[DEBUG] Request body:', req.body);
  console.log('[DEBUG] Request method:', req.method);
  console.log('[DEBUG] Request path:', req.path);

  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      console.log('[DEBUG] Invalid question:', question);
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      });
    }

    console.log('[FarmAdvisor] Processing question:', question);

    // TEMPORARY: Return a simple response to test endpoint
    res.json({
      success: true,
      question,
      response: 'Farm advisor endpoint is working - inline handler with debug logging',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[FarmAdvisor] Error:', error);
    console.error('[FarmAdvisor] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to process farm advisor query',
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// Azure Functions handler - bridges Azure Functions to Express
module.exports = async function (context, req) {
  // Get path from route parameter
  const path = '/' + (req.params.restOfPath || '');

  context.log(`[AZURE] ${req.method} ${path}`);

  return new Promise((resolve, reject) => {
    let responded = false;

    // Create response mock that collects Express response
    const mockRes = {
      statusCode: 200,
      headers: {},
      body: null,
      finished: false,

      status(code) {
        this.statusCode = code;
        return this;
      },

      set(key, value) {
        this.headers[key] = value;
        return this;
      },

      json(data) {
        if (responded) return;
        responded = true;
        this.headers['Content-Type'] = 'application/json';
        this.body = JSON.stringify(data);
        this.finished = true;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },

      send(data) {
        if (responded) return;
        responded = true;
        this.body = typeof data === 'object' ? JSON.stringify(data) : String(data);
        if (typeof data === 'object') {
          this.headers['Content-Type'] = 'application/json';
        }
        this.finished = true;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },

      end(data) {
        if (responded) return;
        responded = true;
        if (data && !this.body) {
          this.body = String(data);
        }
        this.finished = true;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body || '',
        });
      },
    };

    // Create request mock
    const mockReq = {
      method: req.method,
      url: path,
      path: path.split('?')[0],
      headers: req.headers || {},
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
      get(header) {
        return this.headers[header?.toLowerCase()];
      },
    };

    // Timeout safety
    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        context.log.error('[AZURE] Request timeout');
        resolve({
          status: 504,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Gateway Timeout' }),
        });
      }
    }, 29000);

    try {
      // Process request through Express
      app(mockReq, mockRes, (err) => {
        clearTimeout(timeout);
        if (responded) return;
        responded = true;

        if (err) {
          context.log.error('[AZURE] Express error:', err);
          resolve({
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              error: 'Internal Server Error',
              message: err.message,
            }),
          });
        } else {
          // 404 - no route matched
          resolve({
            status: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Not Found' }),
          });
        }
      });
    } catch (error) {
      clearTimeout(timeout);
      if (!responded) {
        responded = true;
        context.log.error('[AZURE] Catch block error:', error);
        resolve({
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack,
          }),
        });
      }
    }
  });
};
