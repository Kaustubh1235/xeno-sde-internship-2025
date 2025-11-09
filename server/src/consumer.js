const amqp = require('amqplib');
const axios = require('axios');
const connectDB = require('./config/db');
const Customer = require('./models/customer');
const Order = require('./models/Order');
const CommunicationLog = require('./models/CommunicationLog');

connectDB();

// Helper function to determine if error is retryable
const isRetryableError = (error) => {
    // Network errors, timeouts, and temporary DB issues should be retried
    return error.code === 'ECONNREFUSED' ||
           error.code === 'ETIMEDOUT' ||
           error.name === 'MongoNetworkError' ||
           error.name === 'MongoTimeoutError' ||
           (error.response && error.response.status >= 500);
};

// Maximum retry attempts for a message
const MAX_RETRIES = 3;

const consumeMessages = async () => {
  try {
    const connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();

    const customerQueue = 'customer_ingestion';
    const orderQueue = 'order_ingestion';
    const deliveryQueue = 'delivery_queue';

    // Dead letter queues for permanent failures
    const customerDLQ = 'customer_ingestion_dlq';
    const orderDLQ = 'order_ingestion_dlq';
    const deliveryDLQ = 'delivery_queue_dlq';

    // Assert main queues with dead letter exchange
    await channel.assertQueue(customerQueue, { durable: true });
    await channel.assertQueue(orderQueue, { durable: true });
    await channel.assertQueue(deliveryQueue, { durable: true });

    // Assert dead letter queues
    await channel.assertQueue(customerDLQ, { durable: true });
    await channel.assertQueue(orderDLQ, { durable: true });
    await channel.assertQueue(deliveryDLQ, { durable: true });

    console.log(" [*] Waiting for messages. To exit press CTRL+C");

    // Consumer for customer ingestion
    channel.consume(customerQueue, async (msg) => {
        if (msg !== null) {
            let content;
            try {
                content = JSON.parse(msg.content.toString());
                console.log(" [x] Received from customer_ingestion:", content);

                await Customer.findOneAndUpdate(
                    { email: content.email }, content,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                console.log(" [x] Customer processed successfully.");
                channel.ack(msg);
            } catch (error) {
                console.error(" [!] Error processing customer:", error);

                // Get retry count from message headers
                const retryCount = (msg.properties.headers && msg.properties.headers['x-retry-count']) || 0;

                if (isRetryableError(error) && retryCount < MAX_RETRIES) {
                    // Requeue with incremented retry count
                    console.log(` [↻] Requeuing customer message (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    channel.nack(msg, false, false);

                    // Send to queue again with updated retry count
                    channel.sendToQueue(customerQueue, msg.content, {
                        persistent: true,
                        headers: { 'x-retry-count': retryCount + 1 }
                    });
                } else {
                    // Permanent failure or max retries exceeded - send to DLQ
                    console.error(` [✗] Sending customer message to DLQ after ${retryCount} retries`);
                    channel.sendToQueue(customerDLQ, msg.content, {
                        persistent: true,
                        headers: {
                            'x-retry-count': retryCount,
                            'x-error': error.message,
                            'x-failed-at': new Date().toISOString()
                        }
                    });
                    channel.ack(msg);
                }
            }
        }
    });

    // Consumer for order ingestion
    channel.consume(orderQueue, async (msg) => {
        if (msg !== null) {
            let content;
            try {
                content = JSON.parse(msg.content.toString());
                console.log(" [x] Received from order_ingestion:", content);

                const { customerId, amount } = content;
                const customer = await Customer.findById(customerId);

                if (!customer) {
                    // Customer not found - permanent failure, send to DLQ
                    console.error(` [!] Customer ${customerId} not found for order. Sending to DLQ.`);
                    channel.sendToQueue(orderDLQ, msg.content, {
                        persistent: true,
                        headers: {
                            'x-error': `Customer ${customerId} not found`,
                            'x-failed-at': new Date().toISOString()
                        }
                    });
                    channel.ack(msg);
                    return;
                }

                const order = new Order({ customerId, amount });
                await order.save();
                customer.totalSpends += amount;
                customer.visitCount += 1;
                customer.lastVisit = new Date();
                await customer.save();
                console.log(" [x] Order processed successfully.");
                channel.ack(msg);
            } catch (error) {
                console.error(" [!] Error processing order:", error);

                const retryCount = (msg.properties.headers && msg.properties.headers['x-retry-count']) || 0;

                if (isRetryableError(error) && retryCount < MAX_RETRIES) {
                    console.log(` [↻] Requeuing order message (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    channel.nack(msg, false, false);

                    channel.sendToQueue(orderQueue, msg.content, {
                        persistent: true,
                        headers: { 'x-retry-count': retryCount + 1 }
                    });
                } else {
                    console.error(` [✗] Sending order message to DLQ after ${retryCount} retries`);
                    channel.sendToQueue(orderDLQ, msg.content, {
                        persistent: true,
                        headers: {
                            'x-retry-count': retryCount,
                            'x-error': error.message,
                            'x-failed-at': new Date().toISOString()
                        }
                    });
                    channel.ack(msg);
                }
            }
        }
    });

    // Consumer for the delivery queue
    channel.consume(deliveryQueue, async (msg) => {
        if (msg !== null) {
            let logId;
            try {
                const content = JSON.parse(msg.content.toString());
                logId = content.logId;
                console.log(` [x] Received delivery job for logId: ${logId}`);

                const log = await CommunicationLog.findById(logId).lean();
                if (!log) {
                    // Log not found - permanent failure, send to DLQ
                    console.error(` [!] Log ${logId} not found. Sending to DLQ.`);
                    channel.sendToQueue(deliveryDLQ, msg.content, {
                        persistent: true,
                        headers: {
                            'x-error': `Log ${logId} not found`,
                            'x-failed-at': new Date().toISOString()
                        }
                    });
                    channel.ack(msg);
                    return;
                }

                // This now correctly points to your live API server
                await axios.post(`${process.env.VITE_API_BASE_URL}/vendor/send`, {
                    logId: log._id,
                    message: log.message
                });
                console.log(` [x] Handed off log ${logId} to vendor.`);
                channel.ack(msg);
            } catch (error) {
                console.error(` [!] Error processing delivery job for ${logId}:`, error);

                const retryCount = (msg.properties.headers && msg.properties.headers['x-retry-count']) || 0;

                if (isRetryableError(error) && retryCount < MAX_RETRIES) {
                    console.log(` [↻] Requeuing delivery message (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    channel.nack(msg, false, false);

                    channel.sendToQueue(deliveryQueue, msg.content, {
                        persistent: true,
                        headers: { 'x-retry-count': retryCount + 1 }
                    });
                } else {
                    console.error(` [✗] Sending delivery message to DLQ after ${retryCount} retries`);
                    channel.sendToQueue(deliveryDLQ, msg.content, {
                        persistent: true,
                        headers: {
                            'x-retry-count': retryCount,
                            'x-error': error.message,
                            'x-failed-at': new Date().toISOString()
                        }
                    });
                    channel.ack(msg);
                }
            }
        }
    });
  } catch (error) {
    console.error("Failed to start consumer:", error);
    // Retry connection after 5 seconds
    setTimeout(consumeMessages, 5000);
  }
};

consumeMessages();