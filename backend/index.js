const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json());

app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

app.post('/order', async (req, res) => {
  const { product_id, customer_name } = req.body;
  const result = await pool.query(
    'INSERT INTO orders (product_id, customer_name, status) VALUES ($1, $2, $3) RETURNING *',
    [product_id, customer_name, 'Pending']
  );
  res.status(201).json(result.rows[0]);
});

app.get('/order/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(result.rows[0]);
});

app.listen(3000, () => console.log('Bakery backend running on port 3000'));