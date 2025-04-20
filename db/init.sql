CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO products (name, price, image_url) VALUES
('Chocolate Cake', 15.99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Croissant', 3.99, 'https://images.unsplash.com/photo-1552590635-27c2c2128abf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Strawberry Tart', 7.50, 'https://images.unsplash.com/photo-1563729780190-41fb49b2c3c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Blueberry Muffin', 4.20, 'https://images.unsplash.com/photo-1532170579296-7820f37b1575?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Cheese Danish', 4.80, 'https://images.unsplash.com/photo-1608190003443-86b2636f7095?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Lemon Drizzle Cake', 6.00, 'https://images.unsplash.com/photo-1608500218806-0a7088d5b0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Cinnamon Roll', 3.75, 'https://images.unsplash.com/photo-1611270636750-7a92691a2a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Banana Bread', 5.50, 'https://images.unsplash.com/photo-1586449480533-5c53c8b5f50c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Macarons (Box of 6)', 9.99, 'https://images.unsplash.com/photo-1497033110241-dce9470e05e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'),
('Vanilla Cupcake', 2.99, 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');