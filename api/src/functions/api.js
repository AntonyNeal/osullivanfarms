/**
 * Azure Functions HTTP Trigger for Express API
 * Routes all API requests through the Express app
 */

const { app } = require('@azure/functions');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const expressApp = express();

// Middleware
expressApp.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Define allowed patterns for your domains
      const allowedPatterns = [
        /^https?:\/\/([a-z0-9-]+\.)?azurestaticapps\.net$/, // Azure Static Web Apps
        /^https?:\/\/([a-z0-9-]+\.)?osullivanfarms\.tech$/, // Your custom domain
        /^http:\/\/localhost(:\d+)?$/, // localhost:*
        /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1:*
      ];

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

expressApp.use(express.json({ limit: '10mb' }));
expressApp.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
try {
  const healthRoutes = require('./routes/health');
  const bookingRoutes = require('./routes/bookings');
  const tenantRoutes = require('./routes/tenants');
  const locationRoutes = require('./routes/locations');
  const availabilityRoutes = require('./routes/availability');
  const paymentRoutes = require('./routes/payments');
  const analyticsRoutes = require('./routes/analytics');
  const tenantAnalyticsRoutes = require('./routes/tenantAnalytics');
  const socialAnalyticsRoutes = require('./routes/socialAnalytics');
  const mobRoutes = require('./routes/mobs');

  // Mount routes
  expressApp.use('/api/health', healthRoutes);
  expressApp.use('/api/bookings', bookingRoutes);
  expressApp.use('/api/tenants', tenantRoutes);
  expressApp.use('/api/locations', locationRoutes);
  expressApp.use('/api/availability', availabilityRoutes);
  expressApp.use('/api/payments', paymentRoutes);
  expressApp.use('/api/analytics', analyticsRoutes);
  expressApp.use('/api/tenant-analytics', tenantAnalyticsRoutes);
  expressApp.use('/api/social-analytics', socialAnalyticsRoutes);
  expressApp.use('/api/mobs', mobRoutes);

  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

// Root endpoint
expressApp.get('/api', (req, res) => {
  res.json({
    message: 'O\'Sullivan Farms API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/bookings',
      '/api/tenants',
      '/api/locations',
      '/api/availability',
      '/api/payments',
      '/api/analytics',
      '/api/tenant-analytics',
      '/api/social-analytics',
      '/api/mobs',
    ],
  });
});

// Azure Functions v4 HTTP handler
app.http('api', {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: '{*segments}',
  handler: async (request, context) => {
    context.log(`HTTP Request: ${request.method} ${request.url}`);

    return new Promise((resolve) => {
      const req = {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        body: request.body,
        query: Object.fromEntries(request.query.entries()),
      };

      const res = {
        statusCode: 200,
        headers: {},
        body: '',
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        set: function (key, value) {
          this.headers[key] = value;
          return this;
        },
        json: function (data) {
          this.headers['Content-Type'] = 'application/json';
          this.body = JSON.stringify(data);
          resolve({
            status: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
        },
        send: function (data) {
          this.body = typeof data === 'string' ? data : JSON.stringify(data);
          resolve({
            status: this.statusCode,
            headers: this.headers,
            body: this.body,
          });
        },
      };

      // Convert Azure Functions request to Express-compatible request
      const mockReq = Object.assign(req, {
        get: (header) => req.headers[header.toLowerCase()],
        path: new URL(request.url).pathname,
      });

      const mockRes = Object.assign(res, {});

      // Handle the request with Express
      expressApp(mockReq, mockRes);
    });
  },
});

module.exports = app;
