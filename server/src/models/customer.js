const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Each customer must have a unique email
  },
  totalSpends: {
    type: Number,
    default: 0,
  },
  visitCount: {
    type: Number,
    default: 0,
  },
  lastVisit: {
    type: Date,
    default: null,
  },
}, {
  // This option adds `createdAt` and `updatedAt` fields automatically
  timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;