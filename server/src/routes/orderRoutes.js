const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// This line defines the POST method for the '/' path relative to '/api/orders'
router.post('/', createOrder); // <-- IS IT 'post' and is the path just '/'?

module.exports = router; // <-- IS THE ROUTER BEING EXPORTED?