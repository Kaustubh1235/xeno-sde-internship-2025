const express = require('express');
const router = express.Router();
const { previewAudience } = require('../controllers/audienceController');

router.post('/preview', previewAudience);

module.exports = router;