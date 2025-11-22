const express = require('express');
const router = express.Router();
const mobController = require('../controllers/mobController');

// Mob routes (no /mobs prefix - already mounted at /mobs in index.js)
router.get('/', mobController.getAllMobs);
router.get('/:id', mobController.getMobById);
router.get('/:id/history', mobController.getMobHistory);
router.post('/', mobController.createMob);
router.put('/:id', mobController.updateMob);

// Farm statistics
router.get('/farm-statistics', mobController.getFarmStatistics);

// Breeding events
router.post('/breeding-events', mobController.recordBreedingEvent);

module.exports = router;
