const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Define allowed patterns
      const allowedPatterns = [
        /^https?:\/\/([a-z0-9-]+\.)?prebooking\.pro$/, // *.prebooking.pro
        /^https?:\/\/([a-z0-9-]+\.)?companionconnect\.app$/, // *.companionconnect.app
        /^https?:\/\/clairehamilton\.vip$/, // clairehamilton.vip
        /^http:\/\/localhost(:\d+)?$/, // localhost:*
        /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1:*
      ];

      // Check if origin matches any pattern
      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'sw-website-api',
  });
});

// Import routes
const tenantRoutes = require('./routes/tenants');
const availabilityRoutes = require('./routes/availability');
const locationRoutes = require('./routes/locations');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');
const healthRoutes = require('./routes/health');

// API routes - All routes deployed
// Note: /api prefix is handled by ingress routing
app.use('/tenants', tenantRoutes);
app.use('/availability', availabilityRoutes);
app.use('/locations', locationRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/health', healthRoutes);

// Legacy endpoints (keep for backward compatibility)
app.get('/api/get-data', async (req, res) => {
  try {
    const data = {
      message: 'Hello from DigitalOcean App Platform',
      timestamp: new Date().toISOString(),
      params: req.query,
    };
    res.json(data);
  } catch (error) {
    console.error('Error in /api/get-data:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      message: error.message,
    });
  }
});

// Example POST endpoint
app.post('/api/submit', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and email are required',
      });
    }

    // Process the data here
    res.json({
      success: true,
      message: 'Data submitted successfully',
      data: { name, email },
    });
  } catch (error) {
    console.error('Error in /api/submit:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
