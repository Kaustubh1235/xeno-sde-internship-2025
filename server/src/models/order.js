const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId, // This creates a reference to the Customer model
    ref: 'Customer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;