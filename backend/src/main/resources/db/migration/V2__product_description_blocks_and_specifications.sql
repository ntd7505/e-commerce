CREATE TABLE product_description_blocks (
    product_description_block_id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) DEFAULT NULL,
    content LONGTEXT DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    alt_text VARCHAR(255) DEFAULT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    active BIT(1) NOT NULL DEFAULT b'1',
    deleted BIT(1) NOT NULL DEFAULT b'0',
    created_at DATETIME(6) DEFAULT NULL,
    updated_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (product_description_block_id),
    KEY idx_product_description_blocks_product (product_id),
    CONSTRAINT fk_product_description_blocks_product
        FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE product_specifications (
    product_specification_id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    group_name VARCHAR(100) DEFAULT NULL,
    spec_key VARCHAR(150) NOT NULL,
    spec_value VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    active BIT(1) NOT NULL DEFAULT b'1',
    deleted BIT(1) NOT NULL DEFAULT b'0',
    created_at DATETIME(6) DEFAULT NULL,
    updated_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (product_specification_id),
    KEY idx_product_specifications_product (product_id),
    CONSTRAINT fk_product_specifications_product
        FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
