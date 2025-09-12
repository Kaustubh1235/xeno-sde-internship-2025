const amqp = require('amqplib');
const connectDB = require('./config/db');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

// Connect to MongoDB
connectDB();

const consumeMessages = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    const customerQueue = 'customer_ingestion';
    const orderQueue = 'order_ingestion';

    await channel.assertQueue(customerQueue, { durable: true });
    await channel.assertQueue(orderQueue, { durable: true });

    console.log(" [*] Waiting for messages in %s and %s. To exit press CTRL+C", customerQueue, orderQueue);

    // Consume customer messages
    channel.consume(customerQueue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log(" [x] Received from customer_ingestion:", content);

        // Database logic for creating a customer
        try {
          await Customer.findOneAndUpdate(
            { email: content.email }, // find a document with that email
            content, // update it with the new data
            { upsert: true, new: true, setDefaultsOnInsert: true } // options
          );
          console.log(" [x] Customer processed successfully.");
        } catch (dbError) {
          console.error(" [!] Error processing customer:", dbError);
        }

        channel.ack(msg);
      }
    });

    // Consume order messages
    channel.consume(orderQueue, async (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log(" [x] Received from order_ingestion:", content);

          // Database logic for creating an order and updating a customer
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

  } catch (error) {
    console.error("Failed to start consumer:", error);
  }
};

consumeMessages();