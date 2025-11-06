-- Insert admin user (password: Admin123)
INSERT INTO users (email, password, role) VALUES 
('admin@example.com', '$2a$10$8K1p/a0dRTlB0Z6sR9.cyu2VY9Vz2KZQZQkQZQZQZQZQZQZQZQZQZ', 'admin'),
('user@example.com', '$2a$10$8K1p/a0dRTlB0Z6sR9.cyu2VY9Vz2KZQZQkQZQZQZQZQZQZQZQZQZ', 'user');

-- Insert sample books
INSERT INTO books (title, description, image_url, uploaded_by) VALUES
('JavaScript: The Good Parts', 'A classic book about JavaScript programming', '/uploads/js-book.jpg', 1),
('Clean Code', 'A handbook of agile software craftsmanship', '/uploads/clean-code.jpg', 1),
('The Pragmatic Programmer', 'Your journey to mastery', '/uploads/pragmatic.jpg', 1);