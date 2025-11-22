const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const mobRoutes = require('./routes/mobs');

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
        /^https?:\/\/([a-z0-9-]+\.)?yourdomain\.com$/, // *.yourdomain.com
        /^https?:\/\/([a-z0-9-]+\.)?your-custom-domain\.com$/, // Custom domain
        /^http:\/\/localhost(:\d+)?$/, // localhost:*
        /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1:*
        /^https:\/\/[\w-]+-[\w-]+-\w+\.ondigitalocean\.app$/, // DigitalOcean apps
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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Service Booking Platform API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API versioning
const apiV1 = express.Router();

// SheepSheet API routes
apiV1.use(mobRoutes);

// Tenant management endpoints
apiV1.get('/tenant/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;

    // TODO: Replace with actual database query
    const tenantConfig = {
      id: tenantId,
      businessName: 'Demo Business',
      customDomain: null,
      status: 'active',
      branding: {
        primaryColor: '#2563eb',
        secondaryColor: '#6366f1',
        logo: null,
      },
      services: [
        {
          id: 'service-1',
          name: 'Consultation',
          description: 'Professional consultation service',
          duration: 60,
          price: 100,
          currency: 'USD',
        },
      ],
      contact: {
        email: 'contact@yourdomain.com',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345',
      },
    };

    res.json(tenantConfig);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking management endpoints
apiV1.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;

    // TODO: Validate booking data
    // TODO: Check availability
    // TODO: Save to database
    // TODO: Send confirmation email

    const booking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

apiV1.get('/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    // TODO: Fetch from database
    const booking = {
      id: bookingId,
      status: 'confirmed',
      // Add other booking details
    };

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics endpoints
apiV1.get('/analytics/stats', async (req, res) => {
  try {
    // TODO: Implement analytics queries
    const stats = {
      totalBookings: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      periodStart: req.query.startDate,
      periodEnd: req.query.endDate,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount API routes
app.use('/api/v1', apiV1);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server only if this file is run directly (not imported as a module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Service Booking Platform API running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
  });
}

// Export app for testing or Azure Functions (if ever needed)
module.exports = app;

module.exports = app;
