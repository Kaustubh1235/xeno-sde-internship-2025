const express = require('express');
const router = express.Router();
const { previewAudience } = require('../controllers/audienceController');

router.post('/preview', previewAudience);
//...
const authCheck = require('../middleware/authCheck');

// Protect this route
router.post('/preview', authCheck, previewAudience);
//...

module.exports = router;