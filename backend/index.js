const express = require('express');
const pool = require('./db');
const amqp = require('amqplib');
const Redis = require('ioredis');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// RabbitMQ Setup
const rabbitmqHost = process.env.RABBITMQ_HOST || 'rabbitmq'; // Default to 'rabbitmq' service name in docker-compose
const rabbitmqUser = process.env.RABBITMQ_USER || 'user';
const rabbitmqPassword = process.env.RABBITMQ_PASSWORD || 'password';

// Wait function to retry RabbitMQ connection
async function waitForRabbitMQ() {
  let retries = 5;
  while (retries > 0) {
    try {
      const connection = await amqp.connect(`amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}`);
      const channel = await connection.createChannel();
      const queue = 'order_queue';
      await channel.assertQueue(queue, { durable: true });
      console.log(`Connected to RabbitMQ at ${rabbitmqHost}`);
      return channel;
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      retries -= 1;
      console.log(`Retrying in 5 seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
  throw new Error('Failed to connect to RabbitMQ after several attempts');
}

// Redis Setup
const redisHost = process.env.REDIS_HOST || 'redis'; // Default to 'redis' service name in docker-compose
const redisPort = process.env.REDIS_PORT || 6379; // Default Redis port
const redis = new Redis({
  host: redisHost,
  port: redisPort,
});

redis.on('connect', () => {
  console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
});

app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

app.post('/order', async (req, res) => {
  const { product_id, customer_name } = req.body;

  // Insert the order into the database
  const result = await pool.query(
    'INSERT INTO orders (product_id, customer_name, status) VALUES ($1, $2, $3) RETURNING *',
    [product_id, customer_name, 'Pending']
  );

  const order = result.rows[0];

  // Send the order to RabbitMQ for processing
  const channel = await waitForRabbitMQ(); // Wait for RabbitMQ connection
  const queue = 'order_queue';
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), { persistent: true });

  console.log('Order sent to RabbitMQ:', order);

  // Cache the order in Redis (optional for fast retrieval)
  redis.set(`order:${order.id}`, JSON.stringify(order));

  res.status(201).json(order);
});

app.get('/order/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(result.rows[0]);
});

// Order Consumer (Worker) - Process Orders from RabbitMQ
async function processOrders() {
  const channel = await waitForRabbitMQ(); // Wait for RabbitMQ connection
  const queue = 'order_queue';

  // Consume orders from the queue
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());

      // Process the order (e.g., update order status in DB)
      const updateResult = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        ['Processing', order.id]
      );

      const processedOrder = updateResult.rows[0];

      // Cache the processed order in Redis
      redis.set(`order:${processedOrder.id}`, JSON.stringify(processedOrder));

      console.log('Order processed:', processedOrder);

      channel.ack(msg); // Acknowledge that the message has been processed
    }
  });
}

// Start processing orders
processOrders();

app.listen(3000, () => console.log('Bakery backend running on port 3000'));