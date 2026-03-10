-- Add refresh tokens table for "remember me" functionality
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Add indexes for better query performance
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens(active);
CREATE INDEX idx_refresh_tokens_expiry ON refresh_tokens(expiry_date);

-- Update users table to use LocalDateTime instead of Instant
ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMP;