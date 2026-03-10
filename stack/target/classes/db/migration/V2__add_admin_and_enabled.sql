-- Add enabled column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;

-- Update role enum to include ADMIN (PostgreSQL specific)
-- Note: This assumes you're using PostgreSQL
-- For other databases, adjust accordingly

-- Create admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
-- Password hash for 'admin123' using BCrypt
INSERT INTO users (username, password_hash, role, enabled, created_at)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', true, NOW())
ON CONFLICT (username) DO NOTHING;
