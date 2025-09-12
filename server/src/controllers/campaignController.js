const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const { buildMongoQuery } = require('./audienceController'); // Import the rule engine
const amqp = require('amqplib');

// This will be our new queue for sending messages
const DELIVERY_QUEUE = 'delivery_queue';

const createCampaign = async (req, res) => {
    try {
        const { query, message } = req.body;

        // 1. Find the audience
        const mongoQuery = buildMongoQuery(query);
        const customers = await Customer.find(mongoQuery).lean();

        if (customers.length === 0) {
            return res.status(400).json({ message: "No customers found for the given criteria." });
        }

        // 2. Create and save the campaign
        const campaign = new Campaign({
            rules: query,
            message,
            stats: { total: customers.length }
        });
        await campaign.save();

        // 3. Create communication logs and queue messages for sending
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
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

            // Publish a job to the delivery queue
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

module.exports = { createCampaign };