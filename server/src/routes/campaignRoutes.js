const express = require('express');
const router = express.Router();
const { createCampaign, handleDeliveryReceipt, getCampaigns } = require('../controllers/campaignController');

// GET /api/campaigns - Fetch all campaigns
router.get('/', getCampaigns);

// POST /api/campaigns - Create a new campaign
router.post('/', createCampaign);
const authCheck = require('../middleware/authCheck');

// Protect these routes
router.get('/', authCheck, getCampaigns);
router.post('/', authCheck, createCampaign);

// This route is called by the vendor, so it should not be protected
router.post('/delivery-receipt', handleDeliveryReceipt)

// POST /api/campaigns/delivery-receipt - Receive status from vendor
router.post('/delivery-receipt', handleDeliveryReceipt);

module.exports = router;