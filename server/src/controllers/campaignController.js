const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/customer');
const { buildMongoQuery } = require('./audienceController');
const amqp = require('amqplib');

const DELIVERY_QUEUE = 'delivery_queue';

const createCampaign = async (req, res) => {
    let connection = null;
    let channel = null;
    let campaign = null;

    try {
        const { query, message } = req.body;

        // Validate inputs
        if (!query || !message) {
            return res.status(400).json({ message: "Query and message are required." });
        }

        const mongoQuery = buildMongoQuery(query);
        const customers = await Customer.find(mongoQuery).lean();

        if (customers.length === 0) {
            return res.status(400).json({ message: "No customers found for the given criteria." });
        }

        // Connect to RabbitMQ BEFORE creating the campaign
        connection = await amqp.connect(process.env.CLOUDAMQP_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(DELIVERY_QUEUE, { durable: true });

        // Create campaign object but don't save yet
        campaign = new Campaign({
            rules: query,
            message,
            stats: { total: customers.length }
        });

        // Create all logs and queue all messages
        const jobs = [];
        for (const customer of customers) {
            const personalizedMessage = message.replace(/{name}/g, customer.name);
            const log = new CommunicationLog({
                campaignId: campaign._id, // Use the _id even though not saved yet
                customerId: customer._id,
                message: personalizedMessage,
            });
            await log.save();

            const job = { logId: log._id };
            jobs.push(job);
        }

        // Queue all jobs - if this fails, we haven't saved the campaign yet
        for (const job of jobs) {
            channel.sendToQueue(DELIVERY_QUEUE, Buffer.from(JSON.stringify(job)), { persistent: true });
        }

        // Only NOW save the campaign after all messages are queued successfully
        await campaign.save();

        await channel.close();
        await connection.close();

        console.log(`[Campaign] Created campaign ${campaign._id} with ${customers.length} messages queued`);
        res.status(201).json(campaign);
    } catch (error) {
        console.error("[Campaign] Error creating campaign:", error);

        // Cleanup: close connections if they exist
        try {
            if (channel) await channel.close();
            if (connection) await connection.close();
        } catch (closeError) {
            console.error("[Campaign] Error closing connections:", closeError);
        }

        // If campaign was created, we should ideally delete it
        // But since logs are already created, this is complex
        // In a real system, you'd use a saga pattern or distributed transaction

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