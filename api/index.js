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
        /^https?:\/\/([a-z0-9-]+\.)?vercel\.app$/, // Vercel deployments
        /^https?:\/\/([a-z0-9-]+\.)?osullivanfarms\.tech$/, // Your custom domain
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

// Import routes
try {
  const bookingRoutes = require('./routes/bookings');
  const statusRoutes = require('./routes/status');
  const paymentRoutes = require('./routes/payments');
  const mobRoutes = require('./routes/mobs');

  // Routes - no /api prefix as Azure Functions adds it
  app.use('/bookings', bookingRoutes);
  app.use('/status', statusRoutes);
  app.use('/payments', paymentRoutes);
  app.use('/mobs', mobRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "O'Sullivan Farms API",
    version: '1.0.0',
    endpoints: ['/health', '/bookings', '/status', '/payments', '/mobs'],
  });
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

// Azure Functions v4 handler
module.exports = async function (context, req) {
  return new Promise((resolve) => {
    // Create a mock response object
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
        this.body = typeof data === 'object' ? JSON.stringify(data) : data;
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },
      end: function () {
        resolve({
          status: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },
    };

    // Create a mock request object
    const mockReq = {
      method: req.method,
      url: req.url || '/',
      headers: req.headers || {},
      body: req.body,
      query: req.query || {},
    };

    // Handle the request with Express
    app(mockReq, res);
  });
};
