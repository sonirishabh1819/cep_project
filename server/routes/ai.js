const express = require('express');
const router = express.Router();
const { suggestPrice, getRecommendations } = require('../services/aiService');
const { protect } = require('../middleware/auth');

router.get('/suggest-price', suggestPrice);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
