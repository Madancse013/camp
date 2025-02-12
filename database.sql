CREATE DATABASE IF NOT EXISTS sports_registration;

USE sports_registration;

CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    sport VARCHAR(50) NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    mother_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    emergency_phone_number VARCHAR(20) NOT NULL,
    child_standard VARCHAR(50) NOT NULL,
    medical_conditions TEXT,
    gender VARCHAR(10) NOT NULL,
    batch VARCHAR(100) NOT NULL,
    timing VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_id VARCHAR(255),
    payment_method VARCHAR(50),
    payment_email VARCHAR(255),
    payment_contact VARCHAR(20),
    payment_amount DECIMAL(10,2),
    payment_currency VARCHAR(10),
    payment_date TIMESTAMP,
    razorpay_order_id VARCHAR(255) NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(512),
    payment_verification_status VARCHAR(20),
    verification_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

