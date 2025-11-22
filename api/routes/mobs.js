const express = require('express');
const router = express.Router();

// Temporary: Test routes without controller to verify router works
router.get('/', (req, res) => {
  res.json({ message: 'Mobs router works!', endpoint: 'GET /' });
});

router.get('/farm-statistics', (req, res) => {
  res.json({ message: 'Farm statistics router works!', endpoint: 'GET /farm-statistics' });
});

// TODO: Re-enable controller routes once database is working
// const mobController = require('../controllers/mobController');
// router.get('/', mobController.getAllMobs);
// etc.

module.exports = router;
