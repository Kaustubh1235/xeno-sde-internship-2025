const amqp = require('amqplib');

const createOrder = async (req, res) => {
  let connection = null;
  let channel = null;

  try {
    const { customerId, amount } = req.body;

    // Validate required fields
    if (!customerId || !amount) {
      return res.status(400).json({ message: 'CustomerId and amount are required' });
    }

    // Validate amount is a positive number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Validate customerId format (MongoDB ObjectId is 24 hex characters)
    if (typeof customerId !== 'string' || customerId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(customerId)) {
      return res.status(400).json({ message: 'Invalid customerId format' });
    }

    connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    channel = await connection.createChannel();
    const queue = 'order_ingestion';

    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify(req.body);
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(" [x] Sent order ingestion message: '%s'", message);
    await channel.close();
    await connection.close();

    // Respond immediately
    res.status(202).json({ message: 'Request accepted for processing.' });

  } catch (error) {
    console.error('[Order] Error creating order:', error);

    // Cleanup connections on error
    try {
      if (channel) await channel.close();
      if (connection) await connection.close();
    } catch (closeError) {
      console.error('[Order] Error closing connections:', closeError);
    }

    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createOrder };