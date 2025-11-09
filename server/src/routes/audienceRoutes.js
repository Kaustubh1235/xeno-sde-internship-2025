const express = require('express');
const router = express.Router();
const { previewAudience } = require('../controllers/audienceController');
const authCheck = require('../middleware/authCheck');

// POST /api/audience/preview - Preview audience based on criteria (protected)
router.post('/preview', authCheck, previewAudience);

module.exports = router;