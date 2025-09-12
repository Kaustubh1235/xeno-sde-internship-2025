const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String }, // We can add a name field later
    rules: { type: Object, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
    stats: {
        total: { type: Number, default: 0 },
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
    },
}, { timestamps: true });
module.exports = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);