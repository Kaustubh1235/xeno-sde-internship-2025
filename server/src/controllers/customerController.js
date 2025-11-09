const amqp = require('amqplib');

const createCustomer = async (req, res) => {
  let connection = null;
  let channel = null;

  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    channel = await connection.createChannel();
    const queue = 'customer_ingestion';

    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify(req.body);
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

    console.log(" [x] Sent customer ingestion message: '%s'", message);
    await channel.close();
    await connection.close();

    // Respond immediately
    res.status(202).json({ message: 'Request accepted for processing.' });

  } catch (error) {
    console.error('[Customer] Error creating customer:', error);

    // Cleanup connections on error
    try {
      if (channel) await channel.close();
      if (connection) await connection.close();
    } catch (closeError) {
      console.error('[Customer] Error closing connections:', closeError);
    }

    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createCustomer };