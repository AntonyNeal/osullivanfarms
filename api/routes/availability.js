/**
 * Availability Routes
 */

const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Get availability calendar for tenant
router.get('/:tenantId', availabilityController.getAvailability);

// Check specific date availability
router.get('/:tenantId/check', availabilityController.checkDateAvailability);

// Get touring schedule
router.get('/:tenantId/touring-schedule', availabilityController.getTouringSchedule);

// Get current location
router.get('/:tenantId/current-location', availabilityController.getCurrentLocation);

// Check availability for specific date
router.get('/:tenantId/check/:date', availabilityController.checkAvailabilityForDate);

// Get available dates in range
router.get('/:tenantId/dates', availabilityController.getAvailableDates);

module.exports = router;
