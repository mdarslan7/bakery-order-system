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
('Croissant', 3.99, 'https://images.unsplash.com/photo-1710220986601-f0b5568673c6?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Strawberry Tart', 7.50, 'https://images.unsplash.com/photo-1591441830800-5a6ae713899c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Blueberry Muffin', 4.20, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Cheese Danish', 4.80, 'https://static01.nyt.com/images/2015/12/23/dining/23JPDANISH4/23JPDANISH4-jumbo.jpg?quality=75&auto=webp'),
('Lemon Drizzle Cake', 6.00, 'https://www.allrecipes.com/thmb/VIdlpDGG52NMMCMGTCRHDhuxsO8=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/7507864LEmonDrizzleCakeChefJohn-b77bae88798d46b78f75152c91254879.jpg'),
('Banana Bread', 5.50, 'https://media.istockphoto.com/id/1147312072/photo/banana-bread-loaf-on-wooden-table.jpg?s=1024x1024&w=is&k=20&c=ryiVDqcftZkRstmVZphB6k5Q6USGDgWGdg_zVB8ii4M='),
('Macarons (Box of 6)', 9.99, 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=1959&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Vanilla Cupcake', 2.99, 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');