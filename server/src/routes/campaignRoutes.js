const express = require('express');
const router = express.Router();
const { createCampaign, handleDeliveryReceipt, getCampaigns } = require('../controllers/campaignController');
const authCheck = require('../middleware/authCheck');

// GET /api/campaigns - Fetch all campaigns (protected)
router.get('/', authCheck, getCampaigns);

// POST /api/campaigns - Create a new campaign (protected)
router.post('/', authCheck, createCampaign);

// POST /api/campaigns/delivery-receipt - Receive status from vendor (unprotected - called by external vendor)
router.post('/delivery-receipt', handleDeliveryReceipt);

module.exports = router;