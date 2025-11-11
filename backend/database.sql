-- Bagaglino E-commerce Database
-- Created for complete e-commerce platform with size management

CREATE DATABASE IF NOT EXISTS bagaglino_db;
USE bagaglino_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    billing_address TEXT,
    shipping_address TEXT,
    token VARCHAR(255) UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with archive functionality
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    gender ENUM('uomo', 'donna', 'unisex') NOT NULL,
    category ENUM('t-shirt', 'maglioni', 'giacche', 'pantaloni', 'scarpe', 'camicie', 'felpe', 'giubbotti', 'accessori') NOT NULL,
    stock INT DEFAULT 0,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product sizes for detailed inventory management
CREATE TABLE product_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_size (product_id, size)
);

-- Favorites table
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, product_id)
);

-- Cart items with size selection
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') DEFAULT 'M',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_surname VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    billing_address TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    status ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items with size tracking
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') DEFAULT 'M',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default admin user
INSERT INTO users (email, password, name, surname, role, token) VALUES 
('admin@bagaglino.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Bagaglino', 'admin', 'admin_token_123');

-- Insert sample test user
INSERT INTO users (email, password, name, surname, role) VALUES 
('user@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', 'user');

-- Sample products with sizes
INSERT INTO products (product_code, name, description, price, gender, category, stock) VALUES 
('TSH001', 'T-shirt Bianca Basic', 'T-shirt in cotone 100% bianca', 29.99, 'unisex', 't-shirt', 20),
('TSH002', 'T-shirt Nera Premium', 'T-shirt nera in cotone organico', 39.99, 'unisex', 't-shirt', 15),
('MAG001', 'Maglione Grigio', 'Maglione in lana merino grigio', 89.99, 'unisex', 'maglioni', 8);

-- Sample sizes for products
INSERT INTO product_sizes (product_id, size, stock) VALUES 
-- T-shirt Bianca (ID 1)
(1, 'XS', 2), (1, 'S', 4), (1, 'M', 6), (1, 'L', 5), (1, 'XL', 2), (1, 'XXL', 1),
-- T-shirt Nera (ID 2)  
(2, 'XS', 1), (2, 'S', 3), (2, 'M', 5), (2, 'L', 4), (2, 'XL', 2), (2, 'XXL', 0),
-- Maglione (ID 3)
(3, 'S', 1), (3, 'M', 3), (3, 'L', 2), (3, 'XL', 2), (3, 'XXL', 0);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_archived ON products(archived);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);