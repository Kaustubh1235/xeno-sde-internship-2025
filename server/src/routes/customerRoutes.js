const express = require('express');
const router = express.Router();
const { createCustomer } = require('../controllers/customerController');

// This route corresponds to /api/customers
router.post('/', createCustomer);

module.exports = router;