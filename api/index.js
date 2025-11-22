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
const { handleFarmAdvisorQuery } = require('./controllers/farmAdvisorController');
const { testServices } = require('./controllers/testController');

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
    endpoints: [
      '/health',
      '/mobs',
      '/farm-statistics',
      '/farm-advisor',
      '/test-services',
    ],
  });
});

// Test services endpoint
app.get('/test-services', testServices);

// Farm Advisor endpoints
app.post('/farm-advisor', handleFarmAdvisorQuery);

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

// Azure Functions v4 handler
module.exports = async function (context, req) {
  // Get path from route parameter
  let url = '/' + (req.params.restOfPath || '');

  // Preserve query string if present
  if (req.url && req.url.includes('?')) {
    const queryString = req.url.substring(req.url.indexOf('?'));
    url += queryString;
  }

  context.log(`Processing ${req.method} ${url}`);
  return new Promise((resolve, reject) => {
    // Create a mock response object that matches Express expectations
    const res = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: '',
      headersSent: false,

      status: function (code) {
        this.statusCode = code;
        return this;
      },

      set: function (key, value) {
        this.headers[key] = value;
        return this;
      },

      setHeader: function (key, value) {
        this.headers[key] = value;
        return this;
      },

      getHeader: function (key) {
        return this.headers[key];
      },

      json: function (data) {
        this.headers['Content-Type'] = 'application/json';
        this.body = JSON.stringify(data);
        this.headersSent = true;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },

      send: function (data) {
        this.body = typeof data === 'object' ? JSON.stringify(data) : String(data);
        if (typeof data === 'object') {
          this.headers['Content-Type'] = 'application/json';
        }
        this.headersSent = true;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },

      end: function (data) {
        if (data) {
          this.body = String(data);
        }
        this.headersSent = true;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },
    };

    // Create a mock request object that matches Express expectations
    const mockReq = {
      method: req.method,
      url: url,
      path: url.split('?')[0],
      originalUrl: url,
      headers: req.headers || {},
      body: req.body,
      query: req.query || {},
      params: req.params || {},
      get: function (header) {
        return this.headers[header.toLowerCase()];
      },
    };

    // Handle the request with Express
    try {
      app(mockReq, res);

      // Timeout fallback in case response isn't sent
      setTimeout(() => {
        if (!res.headersSent) {
          context.log.warn('Request timeout - no response sent');
          resolve({
            status: 504,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Gateway Timeout' }),
          });
        }
      }, 30000); // 30 second timeout
    } catch (error) {
      context.log.error('Error processing request:', error);
      resolve({
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: error.message,
        }),
      });
    }
  });
};
