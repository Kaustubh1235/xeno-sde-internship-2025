const express = require('express');
const router = express.Router();
const { generateRulesFromText } = require('../controllers/aiController');
const authCheck = require('../middleware/authCheck');

// Protect this route to ensure only logged-in users can use the AI feature
router.post('/generate-rules', authCheck, generateRulesFromText);

module.exports = router;