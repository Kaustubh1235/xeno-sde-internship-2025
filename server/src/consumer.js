const amqp = require('amqplib');
const axios = require('axios');
const connectDB = require('./config/db');
const Customer = require('./models/customer');
const Order = require('./models/Order');
const CommunicationLog = require('./models/CommunicationLog');

connectDB();

const consumeMessages = async () => {
  try {
    const connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();

    const customerQueue = 'customer_ingestion';
    const orderQueue = 'order_ingestion';
    const deliveryQueue = 'delivery_queue';

    await channel.assertQueue(customerQueue, { durable: true });
    await channel.assertQueue(orderQueue, { durable: true });
    await channel.assertQueue(deliveryQueue, { durable: true });
    
    console.log(" [*] Waiting for messages. To exit press CTRL+C");

    // Consumer for customer ingestion
    channel.consume(customerQueue, async (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            console.log(" [x] Received from customer_ingestion:", content);
            try {
                await Customer.findOneAndUpdate(
                    { email: content.email }, content,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                console.log(" [x] Customer processed successfully.");
            } catch (dbError) {
                console.error(" [!] Error processing customer:", dbError);
            }
            channel.ack(msg);
        }
    });

    // Consumer for order ingestion
    channel.consume(orderQueue, async (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            console.log(" [x] Received from order_ingestion:", content);
            try {
                const { customerId, amount } = content;
                const customer = await Customer.findById(customerId);
                if (customer) {
                    const order = new Order({ customerId, amount });
                    await order.save();
                    customer.totalSpends += amount;
                    customer.visitCount += 1;
                    customer.lastVisit = new Date();
                    await customer.save();
                    console.log(" [x] Order processed successfully.");
                } else {
                    console.log(" [!] Customer not found for order. Discarding message.");
                }
            } catch (dbError) {
                console.error(" [!] Error processing order:", dbError);
            }
            channel.ack(msg);
        }
    });

    // Consumer for the delivery queue
    channel.consume(deliveryQueue, async (msg) => {
        if (msg !== null) {
            const { logId } = JSON.parse(msg.content.toString());
            console.log(` [x] Received delivery job for logId: ${logId}`);
            try {
                const log = await CommunicationLog.findById(logId).lean();
                if (log) {
                 // This now correctly points to your live API server
await axios.post(`${process.env.VITE_API_BASE_URL}/vendor/send`, {
    logId: log._id,
    message: log.message
});
                    console.log(` [x] Handed off log ${logId} to vendor.`);
                } else {
                    console.log(` [!] Log not found for ${logId}. Discarding job.`);
                }
            } catch(err) {
                // THIS IS THE IMPORTANT CHANGE - WE LOG THE ENTIRE ERROR OBJECT
                console.error(` [!] Error processing delivery job for ${logId}:`, err);
            }
            channel.ack(msg);
        }
    });
  } catch (error) {
    console.error("Failed to start consumer:", error);
  }
};

consumeMessages();