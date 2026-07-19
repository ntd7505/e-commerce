CREATE TABLE home_banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    position VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    image_url VARCHAR(255),
    mobile_image_url VARCHAR(255),
    background_color VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    starts_at DATETIME,
    ends_at DATETIME,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_home_banner_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_home_banners_position ON home_banners(position);
CREATE INDEX idx_home_banners_active ON home_banners(is_active, deleted);
CREATE INDEX idx_home_banners_dates ON home_banners(starts_at, ends_at);
