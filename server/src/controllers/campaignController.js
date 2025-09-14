const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const { buildMongoQuery } = require('./audienceController');
const amqp = require('amqplib');

const DELIVERY_QUEUE = 'delivery_queue';

const createCampaign = async (req, res) => {
    try {
        const { query, message } = req.body;
        const mongoQuery = buildMongoQuery(query);
        const customers = await Customer.find(mongoQuery).lean();

        if (customers.length === 0) {
            return res.status(400).json({ message: "No customers found for the given criteria." });
        }

        const campaign = new Campaign({
            rules: query,
            message,
            stats: { total: customers.length }
        });
        await campaign.save();

        const connection = await amqp.connect('process.env.CLOUDAMQP_URL');
        const channel = await connection.createChannel();
        await channel.assertQueue(DELIVERY_QUEUE, { durable: true });

        for (const customer of customers) {
            const personalizedMessage = message.replace(/{name}/g, customer.name);
            const log = new CommunicationLog({
                campaignId: campaign._id,
                customerId: customer._id,
                message: personalizedMessage,
            });
            await log.save();

            const job = { logId: log._id };
            channel.sendToQueue(DELIVERY_QUEUE, Buffer.from(JSON.stringify(job)), { persistent: true });
        }

        await channel.close();
        await connection.close();
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const handleDeliveryReceipt = async (req, res) => {
    try {
        const { logId, status } = req.body;
        const log = await CommunicationLog.findById(logId);
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }

        log.status = status;
        await log.save();

        const updateField = status === 'SENT' ? 'stats.sent' : 'stats.failed';
        await Campaign.findByIdAndUpdate(log.campaignId, { $inc: { [updateField]: 1 } });

        console.log(`[Receipt API] Updated log ${logId} to ${status}`);
        res.status(200).send('Receipt processed');
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { createCampaign, handleDeliveryReceipt, getCampaigns };