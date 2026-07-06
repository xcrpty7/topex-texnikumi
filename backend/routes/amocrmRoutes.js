const express = require('express');
const router = express.Router();
const amocrm = require('../services/amocrm');

router.get('/status', (req, res) => {
  res.json({
    success: true,
    configured: amocrm.isConfigured(),
  });
});

module.exports = router;
