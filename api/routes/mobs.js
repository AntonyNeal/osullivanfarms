const express = require('express');
const router = express.Router();
const mobController = require('../controllers/mobController');

// Mob routes
router.get('/mobs', mobController.getAllMobs);
router.get('/mobs/:id', mobController.getMobById);
router.get('/mobs/:id/history', mobController.getMobHistory);
router.post('/mobs', mobController.createMob);
router.put('/mobs/:id', mobController.updateMob);

// Farm statistics
router.get('/farm/statistics', mobController.getFarmStatistics);

// Breeding events
router.post('/breeding-events', mobController.recordBreedingEvent);

module.exports = router;
