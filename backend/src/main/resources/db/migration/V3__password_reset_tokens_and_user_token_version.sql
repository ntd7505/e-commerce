ALTER TABLE users
    ADD COLUMN token_version BIGINT NOT NULL DEFAULT 0;

CREATE TABLE password_reset_tokens (
    password_reset_token_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    used_at DATETIME(6) DEFAULT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (password_reset_token_id),
    KEY idx_password_reset_tokens_user_created (user_id, created_at),
    KEY idx_password_reset_tokens_user_active (user_id, used_at),
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
