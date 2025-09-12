const amqp = require('amqplib');

const createOrder = async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    if (!customerId || !amount) {
        return res.status(400).json({ message: 'CustomerId and amount are required' });
    }

    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    const queue = 'order_ingestion';

    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify(req.body);
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(" [x] Sent '%s'", message);
    await channel.close();
    await connection.close();

    // Respond immediately
    res.status(202).json({ message: 'Request accepted for processing.' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createOrder };