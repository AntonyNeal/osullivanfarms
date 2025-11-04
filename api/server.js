const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
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

// API routes
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
