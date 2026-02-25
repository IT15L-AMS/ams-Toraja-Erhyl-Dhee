


CREATE DATABASE IF NOT EXISTS AMS;
USE AMS;


-- Roles Table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);


INSERT INTO roles (role_name) VALUES 
('Admin'),
('Registrar'),
('Instructor'),
('Student');


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_role
        FOREIGN KEY(role_id) 
        REFERENCES roles(id)
        ON DELETE RESTRICT
);


CREATE INDEX idx_users_email ON users(email);
