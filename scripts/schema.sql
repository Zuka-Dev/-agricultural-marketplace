-- Create database schema for Agricultural Produce Marketplace

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, password, role, phone) 
VALUES ('Farm', 'Admin', 'admin@mcpherson.edu', '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 'admin', '+234-800-000-0000')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, quantity, category, image_url) VALUES
('Fresh Tomatoes', 'Organic red tomatoes grown on campus', 800.00, 50, 'Vegetables', '/placeholder.svg?height=300&width=300'),
('Sweet Corn', 'Fresh sweet corn harvested daily', 500.00, 30, 'Vegetables', '/placeholder.svg?height=300&width=300'),
('Farm Eggs', 'Free-range chicken eggs from our poultry', 1200.00, 100, 'Poultry', '/placeholder.svg?height=300&width=300'),
('Organic Lettuce', 'Crisp organic lettuce leaves', 600.00, 25, 'Vegetables', '/placeholder.svg?height=300&width=300'),
('Fresh Carrots', 'Orange carrots rich in vitamins', 700.00, 40, 'Vegetables', '/placeholder.svg?height=300&width=300'),
('Farm Milk', 'Fresh cow milk from our dairy', 1000.00, 20, 'Dairy', '/placeholder.svg?height=300&width=300'),
('Organic Spinach', 'Nutrient-rich spinach leaves', 900.00, 35, 'Vegetables', '/placeholder.svg?height=300&width=300'),
('Sweet Potatoes', 'Orange sweet potatoes', 400.00, 60, 'Vegetables', '/placeholder.svg?height=300&width=300')
ON CONFLICT DO NOTHING;
