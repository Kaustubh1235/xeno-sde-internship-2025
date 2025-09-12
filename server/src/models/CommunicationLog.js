const mongoose = require('mongoose');

// This line defines the variable 'communicationLogSchema'
const communicationLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
}, { timestamps: true });


// This line USES the variable 'communicationLogSchema'
// It also includes the fix from the previous error.
module.exports = mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', communicationLogSchema);