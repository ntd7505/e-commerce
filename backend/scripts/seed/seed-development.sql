-- NexaMart development/demo seed for MySQL 8.
--
-- Run only against a local development database after Flyway V1-V4:
--   $OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
--   Get-Content -Raw -Encoding UTF8 scripts/seed/seed-development.sql | docker compose exec -T mysql mysql -uroot -proot ecommerce_db
--
-- The script is idempotent.  It replaces media, description blocks and specifications
-- only for the product slugs declared below, and replaces orders whose note starts with
-- "[DEV-SEED]".  Do not run it against production data.

SET NAMES utf8mb4;
SET time_zone = '+07:00';
START TRANSACTION;

-- -----------------------------------------------------------------------------
-- 1. Roles, permissions and demo accounts
-- -----------------------------------------------------------------------------
INSERT INTO permission (name, description) VALUES
    ('PRODUCT_MANAGE', 'Allows product management'),
    ('BRAND_MANAGE', 'Allows brand management'),
    ('COUPON_MANAGE', 'Allows coupon management'),
    ('ORDER_MANAGE', 'Allows order management'),
    ('USER_MANAGE', 'Allows user management')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO roles (name, description) VALUES
    ('ADMIN', 'System administrator'),
    ('STAFF', 'Store staff'),
    ('CUSTOMER', 'Customer account')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT IGNORE INTO roles_permissions (role_name, permissions_name)
SELECT 'ADMIN', name FROM permission WHERE name IN (
    'PRODUCT_MANAGE', 'BRAND_MANAGE', 'COUPON_MANAGE', 'ORDER_MANAGE', 'USER_MANAGE'
);

INSERT IGNORE INTO roles_permissions (role_name, permissions_name)
SELECT 'STAFF', name FROM permission WHERE name IN (
    'PRODUCT_MANAGE', 'BRAND_MANAGE', 'COUPON_MANAGE', 'ORDER_MANAGE'
);

-- Demo credentials: admin@gmail.com / admin, customer@example.com / customer.
INSERT INTO users (email, password, full_name, phone_number, avatar_url, status, is_deleted, token_version, created_at, update_at)
VALUES
    ('admin@gmail.com', '$2a$10$KpQkDrqBRw6ScoBJJgkDuea.whoJ1c09rR4PAsWLHGDOgHids5zvq', 'Quản trị viên NexaMart', '0900000001', NULL, 'ACTIVE', b'0', 0, NOW(6), NOW(6)),
    ('customer@example.com', '$2a$10$EbOX2kz84hj/n46EnJU8KewvfxAsZEIo0LlXptuD8Kt5ucuKWfcQO', 'Nguyễn Minh Anh', '0900000002', NULL, 'ACTIVE', b'0', 0, NOW(6), NOW(6)),
    ('linh.nguyen@example.com', '$2a$10$EbOX2kz84hj/n46EnJU8KewvfxAsZEIo0LlXptuD8Kt5ucuKWfcQO', 'Nguyễn Thùy Linh', '0900000003', NULL, 'ACTIVE', b'0', 0, NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
    password = VALUES(password), full_name = VALUES(full_name), status = 'ACTIVE', is_deleted = b'0', update_at = NOW(6);

INSERT IGNORE INTO users_roles (user_id, role_name)
SELECT id, 'ADMIN' FROM users WHERE email = 'admin@gmail.com';
INSERT IGNORE INTO users_roles (user_id, role_name)
SELECT id, 'CUSTOMER' FROM users WHERE email IN ('customer@example.com', 'linh.nguyen@example.com');

-- -----------------------------------------------------------------------------
-- 2. Catalog: categories, brands, products, variants and media
-- -----------------------------------------------------------------------------
UPDATE category SET name = 'Điện thoại - Máy tính bảng', description = 'Điện thoại và máy tính bảng chính hãng', active = b'1', deleted = b'0', parent_id = NULL, updated_at = NOW(6) WHERE slug = 'dien-thoai-may-tinh-bang';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Điện thoại - Máy tính bảng', 'dien-thoai-may-tinh-bang', 'Điện thoại và máy tính bảng chính hãng', b'1', b'0', NULL, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug = 'dien-thoai-may-tinh-bang');

UPDATE category SET name = 'Laptop - Máy vi tính', description = 'Laptop và máy tính cho học tập, làm việc', active = b'1', deleted = b'0', parent_id = NULL, updated_at = NOW(6) WHERE slug = 'laptop-may-vi-tinh';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Laptop - Máy vi tính', 'laptop-may-vi-tinh', 'Laptop và máy tính cho học tập, làm việc', b'1', b'0', NULL, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug = 'laptop-may-vi-tinh');

UPDATE category SET name = 'Phụ kiện công nghệ', description = 'Tai nghe, chuột và phụ kiện số', active = b'1', deleted = b'0', parent_id = NULL, updated_at = NOW(6) WHERE slug = 'phu-kien-cong-nghe';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Phụ kiện công nghệ', 'phu-kien-cong-nghe', 'Tai nghe, chuột và phụ kiện số', b'1', b'0', NULL, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug = 'phu-kien-cong-nghe');

UPDATE category SET name = 'Thiết bị gia dụng', description = 'Thiết bị gia dụng thông minh', active = b'1', deleted = b'0', parent_id = NULL, updated_at = NOW(6) WHERE slug = 'thiet-bi-gia-dung';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Thiết bị gia dụng', 'thiet-bi-gia-dung', 'Thiết bị gia dụng thông minh', b'1', b'0', NULL, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM category WHERE slug = 'thiet-bi-gia-dung');

UPDATE category SET name = 'Điện thoại thông minh', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'dien-thoai-may-tinh-bang') AS parent_category), updated_at = NOW(6) WHERE slug = 'dien-thoai-thong-minh';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Điện thoại thông minh', 'dien-thoai-thong-minh', 'Điện thoại thông minh chính hãng', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'dien-thoai-may-tinh-bang' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'dien-thoai-thong-minh');

UPDATE category SET name = 'Laptop', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'laptop-may-vi-tinh') AS parent_category), updated_at = NOW(6) WHERE slug = 'laptop';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Laptop', 'laptop', 'Laptop chính hãng', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'laptop-may-vi-tinh' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'laptop');

UPDATE category SET name = 'Tai nghe', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'phu-kien-cong-nghe') AS parent_category), updated_at = NOW(6) WHERE slug = 'tai-nghe';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Tai nghe', 'tai-nghe', 'Tai nghe không dây và có dây', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'phu-kien-cong-nghe' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'tai-nghe');

UPDATE category SET name = 'Robot hút bụi', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'thiet-bi-gia-dung') AS parent_category), updated_at = NOW(6) WHERE slug = 'robot-hut-bui';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Robot hút bụi', 'robot-hut-bui', 'Robot hút bụi thông minh', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'thiet-bi-gia-dung' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'robot-hut-bui');

UPDATE category SET name = 'Máy tính bảng', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'dien-thoai-may-tinh-bang') AS parent_category), updated_at = NOW(6) WHERE slug = 'may-tinh-bang';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Máy tính bảng', 'may-tinh-bang', 'Máy tính bảng phục vụ học tập và giải trí', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'dien-thoai-may-tinh-bang' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'may-tinh-bang');

UPDATE category SET name = 'Màn hình máy tính', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'laptop-may-vi-tinh') AS parent_category), updated_at = NOW(6) WHERE slug = 'man-hinh-may-tinh';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Màn hình máy tính', 'man-hinh-may-tinh', 'Màn hình làm việc và chơi game', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'laptop-may-vi-tinh' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'man-hinh-may-tinh');

UPDATE category SET name = 'Chuột và bàn phím', active = b'1', deleted = b'0', parent_id = (SELECT id FROM (SELECT id FROM category WHERE slug = 'phu-kien-cong-nghe') AS parent_category), updated_at = NOW(6) WHERE slug = 'chuot-va-ban-phim';
INSERT INTO category (name, slug, description, active, deleted, parent_id, created_at, updated_at)
SELECT 'Chuột và bàn phím', 'chuot-va-ban-phim', 'Thiết bị nhập liệu cho công việc và gaming', b'1', b'0', id, NOW(6), NOW(6)
FROM category WHERE slug = 'phu-kien-cong-nghe' AND NOT EXISTS (SELECT 1 FROM category WHERE slug = 'chuot-va-ban-phim');

INSERT INTO brands (name, slug, logo_url, active, deleted, created_at, update_at) VALUES
    ('Apple', 'apple', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('Samsung', 'samsung', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('ASUS', 'asus', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('Sony', 'sony', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('Xiaomi', 'xiaomi', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('Dell', 'dell', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('LG', 'lg', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('Logitech', 'logitech', NULL, b'1', b'0', NOW(6), NOW(6)),
    ('Keychron', 'keychron', NULL, b'1', b'0', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE slug = VALUES(slug), active = b'1', deleted = b'0', update_at = NOW(6);

INSERT INTO products (name, slug, short_description, description, brand_id, category_id, active, deleted, created_at, update_at) VALUES
    ('iPhone 15 128GB', 'iphone-15-128gb', 'Dynamic Island, camera 48MP và cổng USB-C.', 'iPhone 15 mang đến hiệu năng mạnh mẽ, camera chất lượng cao và thiết kế hiện đại.', (SELECT id FROM brands WHERE slug = 'apple'), (SELECT id FROM category WHERE slug = 'dien-thoai-thong-minh'), b'1', b'0', NOW(6), NOW(6)),
    ('Samsung Galaxy S24 5G', 'samsung-galaxy-s24-5g', 'Thiết kế cao cấp cùng hiệu năng Galaxy AI.', 'Galaxy S24 5G phù hợp cho nhu cầu công việc, giải trí và sáng tạo mỗi ngày.', (SELECT id FROM brands WHERE slug = 'samsung'), (SELECT id FROM category WHERE slug = 'dien-thoai-thong-minh'), b'1', b'0', NOW(6), NOW(6)),
    ('ASUS Zenbook 14 OLED', 'asus-zenbook-14-oled', 'Laptop mỏng nhẹ với màn hình OLED sắc nét.', 'Zenbook 14 OLED là lựa chọn cân bằng giữa tính di động, hiệu năng và thời lượng pin.', (SELECT id FROM brands WHERE slug = 'asus'), (SELECT id FROM category WHERE slug = 'laptop'), b'1', b'0', NOW(6), NOW(6)),
    ('Tai nghe Sony WH-1000XM5', 'tai-nghe-sony-wh-1000xm5', 'Chống ồn chủ động, âm thanh chi tiết.', 'Sony WH-1000XM5 cung cấp trải nghiệm nghe nhạc cao cấp với chống ồn thông minh.', (SELECT id FROM brands WHERE slug = 'sony'), (SELECT id FROM category WHERE slug = 'tai-nghe'), b'1', b'0', NOW(6), NOW(6)),
    ('Xiaomi Robot Vacuum S10', 'xiaomi-robot-vacuum-s10', 'Robot hút bụi lau nhà với điều hướng thông minh.', 'Robot Vacuum S10 tự động làm sạch hiệu quả, hỗ trợ điều khiển linh hoạt qua ứng dụng.', (SELECT id FROM brands WHERE slug = 'xiaomi'), (SELECT id FROM category WHERE slug = 'robot-hut-bui'), b'1', b'0', NOW(6), NOW(6)),
    ('iPad Air M2 11 inch', 'ipad-air-m2-11-inch', 'Tablet mỏng nhẹ với chip Apple M2.', 'iPad Air M2 phù hợp cho học tập, sáng tạo nội dung và giải trí mỗi ngày.', (SELECT id FROM brands WHERE slug = 'apple'), (SELECT id FROM category WHERE slug = 'may-tinh-bang'), b'1', b'0', NOW(6), NOW(6)),
    ('MacBook Air M3 13 inch', 'macbook-air-m3-13-inch', 'Laptop Apple M3 mỏng nhẹ, pin dài.', 'MacBook Air M3 đem lại hiệu năng linh hoạt cho công việc và học tập.', (SELECT id FROM brands WHERE slug = 'apple'), (SELECT id FROM category WHERE slug = 'laptop'), b'1', b'0', NOW(6), NOW(6)),
    ('Dell UltraSharp U2723QE', 'dell-ultrasharp-u2723qe', 'Màn hình 4K IPS Black 27 inch.', 'Dell UltraSharp U2723QE hiển thị sắc nét, phù hợp làm việc chuyên nghiệp.', (SELECT id FROM brands WHERE slug = 'dell'), (SELECT id FROM category WHERE slug = 'man-hinh-may-tinh'), b'1', b'0', NOW(6), NOW(6)),
    ('LG UltraGear 27GP850-B', 'lg-ultragear-27gp850-b', 'Màn hình gaming QHD 165Hz.', 'LG UltraGear mang đến tốc độ làm mới cao và hình ảnh mượt mà cho game thủ.', (SELECT id FROM brands WHERE slug = 'lg'), (SELECT id FROM category WHERE slug = 'man-hinh-may-tinh'), b'1', b'0', NOW(6), NOW(6)),
    ('Logitech MX Master 3S', 'logitech-mx-master-3s', 'Chuột không dây công thái học.', 'MX Master 3S vận hành êm ái, chính xác và phù hợp làm việc năng suất.', (SELECT id FROM brands WHERE slug = 'logitech'), (SELECT id FROM category WHERE slug = 'chuot-va-ban-phim'), b'1', b'0', NOW(6), NOW(6)),
    ('AirPods Pro 2 USB-C', 'airpods-pro-2-usb-c', 'Tai nghe không dây có chống ồn chủ động.', 'AirPods Pro 2 kết hợp âm thanh sống động, chống ồn và hộp sạc USB-C.', (SELECT id FROM brands WHERE slug = 'apple'), (SELECT id FROM category WHERE slug = 'tai-nghe'), b'1', b'0', NOW(6), NOW(6)),
    ('Keychron K2 V2', 'keychron-k2-v2', 'Bàn phím cơ không dây layout gọn.', 'Keychron K2 V2 hỗ trợ nhiều thiết bị và đem lại cảm giác gõ tốt.', (SELECT id FROM brands WHERE slug = 'keychron'), (SELECT id FROM category WHERE slug = 'chuot-va-ban-phim'), b'1', b'0', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
    name = VALUES(name), short_description = VALUES(short_description), description = VALUES(description), brand_id = VALUES(brand_id), category_id = VALUES(category_id), active = b'1', deleted = b'0', update_at = NOW(6);

INSERT INTO product_variants (variant_name, stock_quantity, price, sale_price, currency, sku, active, deleted, product_id, created_at, update_at) VALUES
    ('128GB - Đen', 37, 22990000, 19990000, 'VND', 'APL-IP15-128-BLK', b'1', b'0', (SELECT id FROM products WHERE slug = 'iphone-15-128gb'), NOW(6), NOW(6)),
    ('128GB - Xanh dương', 24, 22990000, 20490000, 'VND', 'APL-IP15-128-BLU', b'1', b'0', (SELECT id FROM products WHERE slug = 'iphone-15-128gb'), NOW(6), NOW(6)),
    ('256GB - Đen Onyx', 31, 22990000, 18490000, 'VND', 'SAM-S24-256-ONYX', b'1', b'0', (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), NOW(6), NOW(6)),
    ('256GB - Tím Cobalt', 18, 22990000, 18990000, 'VND', 'SAM-S24-256-VIO', b'1', b'0', (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), NOW(6), NOW(6)),
    ('Core Ultra 7 / 16GB / 512GB', 16, 24990000, 22490000, 'VND', 'ASU-ZB14-U7-16-512', b'1', b'0', (SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), NOW(6), NOW(6)),
    ('Core Ultra 5 / 16GB / 512GB', 12, 22990000, 20990000, 'VND', 'ASU-ZB14-U5-16-512', b'1', b'0', (SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), NOW(6), NOW(6)),
    ('Đen', 25, 8990000, 6990000, 'VND', 'SNY-WH1000XM5-BLK', b'1', b'0', (SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), NOW(6), NOW(6)),
    ('Bạc', 14, 8990000, 7190000, 'VND', 'SNY-WH1000XM5-SLV', b'1', b'0', (SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), NOW(6), NOW(6)),
    ('Trắng', 20, 8990000, 7490000, 'VND', 'XMI-S10-WHT', b'1', b'0', (SELECT id FROM products WHERE slug = 'xiaomi-robot-vacuum-s10'), NOW(6), NOW(6)),
    ('128GB - Xám không gian', 22, 16990000, 15490000, 'VND', 'APL-IPAD-AIR-M2-128-GRY', b'1', b'0', (SELECT id FROM products WHERE slug = 'ipad-air-m2-11-inch'), NOW(6), NOW(6)),
    ('8GB / 256GB - Midnight', 15, 29990000, 28490000, 'VND', 'APL-MBA-M3-8-256-MID', b'1', b'0', (SELECT id FROM products WHERE slug = 'macbook-air-m3-13-inch'), NOW(6), NOW(6)),
    ('27 inch - 4K IPS Black', 11, 16990000, 14990000, 'VND', 'DEL-U2723QE-27-4K', b'1', b'0', (SELECT id FROM products WHERE slug = 'dell-ultrasharp-u2723qe'), NOW(6), NOW(6)),
    ('27 inch - QHD 165Hz', 18, 11990000, 9990000, 'VND', 'LG-27GP850B-QHD', b'1', b'0', (SELECT id FROM products WHERE slug = 'lg-ultragear-27gp850-b'), NOW(6), NOW(6)),
    ('Graphite', 42, 2690000, 2490000, 'VND', 'LOG-MX-MASTER-3S-GRY', b'1', b'0', (SELECT id FROM products WHERE slug = 'logitech-mx-master-3s'), NOW(6), NOW(6)),
    ('USB-C', 34, 6990000, 5990000, 'VND', 'APL-AIRPODS-PRO2-USBC', b'1', b'0', (SELECT id FROM products WHERE slug = 'airpods-pro-2-usb-c'), NOW(6), NOW(6)),
    ('Gateron Brown - RGB', 28, 2990000, 2690000, 'VND', 'KEY-K2V2-BROWN-RGB', b'1', b'0', (SELECT id FROM products WHERE slug = 'keychron-k2-v2'), NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
    variant_name = VALUES(variant_name), stock_quantity = VALUES(stock_quantity), price = VALUES(price), sale_price = VALUES(sale_price), currency = VALUES(currency), active = b'1', deleted = b'0', product_id = VALUES(product_id), update_at = NOW(6);

-- Replace rich content only for the seeded product slugs, making this section re-runnable.
DELETE pm FROM product_media pm JOIN products p ON p.id = pm.product_id
WHERE p.slug IN ('iphone-15-128gb', 'samsung-galaxy-s24-5g', 'asus-zenbook-14-oled', 'tai-nghe-sony-wh-1000xm5', 'xiaomi-robot-vacuum-s10', 'ipad-air-m2-11-inch', 'macbook-air-m3-13-inch', 'dell-ultrasharp-u2723qe', 'lg-ultragear-27gp850-b', 'logitech-mx-master-3s', 'airpods-pro-2-usb-c', 'keychron-k2-v2');

INSERT INTO product_media (url, media_type, is_thumbnail, sort_order, alt_text, active, deleted, product_id, created_at, updated_at) VALUES
    ('https://res.cloudinary.com/ddgmxbls3/image/upload/v1782716307/ecommerce/products/fivghhnyypkwakf5b9dg.webp', 'IMAGE', b'1', 0, 'iPhone 15 128GB màu đen', b'1', b'0', (SELECT id FROM products WHERE slug = 'iphone-15-128gb'), NOW(6), NOW(6)),
    ('https://res.cloudinary.com/ddgmxbls3/image/upload/v1782716402/ecommerce/products/omaju0c2s9dgzixpik70.webp', 'IMAGE', b'0', 1, 'iPhone 15 128GB xanh dương', b'1', b'0', (SELECT id FROM products WHERE slug = 'iphone-15-128gb'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'Samsung Galaxy S24 5G', b'1', b'0', (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'0', 1, 'Samsung Galaxy S24 5G mặt lưng', b'1', b'0', (SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'ASUS Zenbook 14 OLED', b'1', b'0', (SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'0', 1, 'ASUS Zenbook 14 OLED mở màn hình', b'1', b'0', (SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'Tai nghe Sony WH-1000XM5', b'1', b'0', (SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'0', 1, 'Tai nghe Sony WH-1000XM5 khi sử dụng', b'1', b'0', (SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'Xiaomi Robot Vacuum S10', b'1', b'0', (SELECT id FROM products WHERE slug = 'xiaomi-robot-vacuum-s10'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'iPad Air M2 11 inch', b'1', b'0', (SELECT id FROM products WHERE slug = 'ipad-air-m2-11-inch'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'MacBook Air M3 13 inch', b'1', b'0', (SELECT id FROM products WHERE slug = 'macbook-air-m3-13-inch'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'Dell UltraSharp U2723QE', b'1', b'0', (SELECT id FROM products WHERE slug = 'dell-ultrasharp-u2723qe'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'LG UltraGear 27GP850-B', b'1', b'0', (SELECT id FROM products WHERE slug = 'lg-ultragear-27gp850-b'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'Logitech MX Master 3S', b'1', b'0', (SELECT id FROM products WHERE slug = 'logitech-mx-master-3s'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1606741965429-1db9f2d1f7d1?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'AirPods Pro 2 USB-C', b'1', b'0', (SELECT id FROM products WHERE slug = 'airpods-pro-2-usb-c'), NOW(6), NOW(6)),
    ('https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80', 'IMAGE', b'1', 0, 'Keychron K2 V2', b'1', b'0', (SELECT id FROM products WHERE slug = 'keychron-k2-v2'), NOW(6), NOW(6));

DELETE pdb FROM product_description_blocks pdb JOIN products p ON p.id = pdb.product_id
WHERE p.slug IN ('iphone-15-128gb', 'samsung-galaxy-s24-5g', 'asus-zenbook-14-oled', 'tai-nghe-sony-wh-1000xm5', 'xiaomi-robot-vacuum-s10', 'ipad-air-m2-11-inch', 'macbook-air-m3-13-inch', 'dell-ultrasharp-u2723qe', 'lg-ultragear-27gp850-b', 'logitech-mx-master-3s', 'airpods-pro-2-usb-c', 'keychron-k2-v2');

INSERT INTO product_description_blocks (product_id, type, title, content, image_url, alt_text, sort_order, active, deleted, created_at, updated_at) VALUES
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'TEXT', 'Trải nghiệm iPhone thế hệ mới', 'Dynamic Island giúp các thông báo và hoạt động trực tiếp luôn trong tầm mắt. Chip xử lý mạnh mẽ đáp ứng tốt nhu cầu hằng ngày.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'IMAGE', NULL, NULL, 'https://res.cloudinary.com/ddgmxbls3/image/upload/v1782716307/ecommerce/products/fivghhnyypkwakf5b9dg.webp', 'Thiết kế iPhone 15', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), 'TEXT_IMAGE', 'Thiết kế tinh tế, sẵn sàng cho mọi khoảnh khắc', 'Galaxy S24 5G kết hợp màn hình sống động, camera linh hoạt và hiệu năng ổn định cho cả ngày dài.', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80', 'Samsung Galaxy S24 5G', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), 'TEXT_IMAGE', 'Sáng tạo không giới hạn', 'Màn hình OLED cho màu sắc sống động, thân máy gọn nhẹ để bạn dễ dàng mang theo mỗi ngày.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80', 'ASUS Zenbook 14 OLED', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), 'TEXT_IMAGE', 'Âm thanh đắm chìm', 'Công nghệ chống ồn chủ động giúp bạn tập trung vào âm nhạc, cuộc gọi và công việc.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 'Sony WH-1000XM5', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'xiaomi-robot-vacuum-s10'), 'TEXT', 'Làm sạch chủ động mỗi ngày', 'Robot hút bụi lau nhà vận hành theo lộ trình thông minh, giúp tiết kiệm thời gian chăm sóc không gian sống.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'ipad-air-m2-11-inch'), 'TEXT', 'Linh hoạt cho mọi ý tưởng', 'iPad Air M2 mang lại hiệu năng mạnh mẽ trong một thiết kế gọn nhẹ.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'macbook-air-m3-13-inch'), 'TEXT', 'Mỏng nhẹ, sẵn sàng di chuyển', 'MacBook Air M3 xử lý mượt mà các tác vụ học tập và công việc hằng ngày.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'dell-ultrasharp-u2723qe'), 'TEXT', 'Không gian hiển thị chuyên nghiệp', 'Màn hình 4K giúp thể hiện chi tiết rõ nét cho công việc sáng tạo.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'lg-ultragear-27gp850-b'), 'TEXT', 'Tốc độ cho từng khung hình', 'Tần số quét cao hỗ trợ trải nghiệm gaming mượt mà hơn.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'logitech-mx-master-3s'), 'TEXT', 'Tối ưu hiệu suất làm việc', 'Thiết kế công thái học và cuộn siêu nhanh cho các tác vụ dài.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'airpods-pro-2-usb-c'), 'TEXT', 'Âm thanh cá nhân hóa', 'Chống ồn chủ động kết hợp âm thanh không gian sống động.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'keychron-k2-v2'), 'TEXT', 'Gõ thoải mái trên nhiều thiết bị', 'Bàn phím cơ gọn gàng, phù hợp bàn làm việc hiện đại.', NULL, NULL, 0, b'1', b'0', NOW(6), NOW(6));

DELETE ps FROM product_specifications ps JOIN products p ON p.id = ps.product_id
WHERE p.slug IN ('iphone-15-128gb', 'samsung-galaxy-s24-5g', 'asus-zenbook-14-oled', 'tai-nghe-sony-wh-1000xm5', 'xiaomi-robot-vacuum-s10', 'ipad-air-m2-11-inch', 'macbook-air-m3-13-inch', 'dell-ultrasharp-u2723qe', 'lg-ultragear-27gp850-b', 'logitech-mx-master-3s', 'airpods-pro-2-usb-c', 'keychron-k2-v2');

INSERT INTO product_specifications (product_id, group_name, spec_key, spec_value, sort_order, active, deleted, created_at, updated_at) VALUES
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'Thông tin chung', 'Thương hiệu', 'Apple', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'Màn hình', 'Kích thước màn hình', '6.1 inch Super Retina XDR', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'Hiệu năng', 'Chip xử lý', 'Apple A16 Bionic', 2, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'Camera', 'Camera chính', '48MP', 3, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), 'Thông tin chung', 'Thương hiệu', 'Samsung', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-5g'), 'Màn hình', 'Tần số quét', '120Hz', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), 'Hiệu năng', 'Bộ nhớ RAM', '16GB', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), 'Hiệu năng', 'Ổ cứng', '512GB SSD', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), 'Âm thanh', 'Chống ồn', 'Chống ồn chủ động ANC', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), 'Kết nối', 'Bluetooth', 'Bluetooth 5.2', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'xiaomi-robot-vacuum-s10'), 'Làm sạch', 'Lực hút', '4000Pa', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'xiaomi-robot-vacuum-s10'), 'Pin', 'Thời lượng hoạt động', 'Lên đến 130 phút', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'ipad-air-m2-11-inch'), 'Hiệu năng', 'Chip xử lý', 'Apple M2', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'ipad-air-m2-11-inch'), 'Màn hình', 'Kích thước', '11 inch Liquid Retina', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'macbook-air-m3-13-inch'), 'Hiệu năng', 'Chip xử lý', 'Apple M3', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'macbook-air-m3-13-inch'), 'Bộ nhớ', 'Ổ cứng', '256GB SSD', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'dell-ultrasharp-u2723qe'), 'Hiển thị', 'Độ phân giải', '4K UHD 3840 x 2160', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'dell-ultrasharp-u2723qe'), 'Hiển thị', 'Kích thước', '27 inch', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'lg-ultragear-27gp850-b'), 'Hiển thị', 'Tần số quét', '165Hz', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'lg-ultragear-27gp850-b'), 'Hiển thị', 'Độ phân giải', 'QHD 2560 x 1440', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'logitech-mx-master-3s'), 'Kết nối', 'Kết nối', 'Bluetooth và Logi Bolt', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'logitech-mx-master-3s'), 'Pin', 'Thời lượng pin', 'Lên đến 70 ngày', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'airpods-pro-2-usb-c'), 'Âm thanh', 'Chống ồn', 'Chống ồn chủ động ANC', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'airpods-pro-2-usb-c'), 'Kết nối', 'Cổng sạc', 'USB-C', 1, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'keychron-k2-v2'), 'Bàn phím', 'Kiểu switch', 'Gateron Brown', 0, b'1', b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'keychron-k2-v2'), 'Kết nối', 'Kết nối', 'Bluetooth 5.1 và USB-C', 1, b'1', b'0', NOW(6), NOW(6));

-- -----------------------------------------------------------------------------
-- 3. Coupons and active home banners
-- -----------------------------------------------------------------------------
INSERT INTO coupon (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, per_user_limit, start_at, end_at, active, deleted, created_at, updated_at) VALUES
    ('NEXA5', 'Giảm 5% cho đơn từ 500K', 'Giảm tối đa 100.000đ cho đơn hàng từ 500.000đ.', 'PERCENT', 5.00, 500000.00, 100000.00, 500, 1, 1, DATE_SUB(NOW(6), INTERVAL 7 DAY), DATE_ADD(NOW(6), INTERVAL 90 DAY), b'1', b'0', NOW(6), NOW(6)),
    ('FREESHIP50', 'Giảm 50.000đ phí vận chuyển', 'Áp dụng cho đơn từ 1.000.000đ.', 'FIXED_AMOUNT', 50000.00, 1000000.00, NULL, 300, 0, 1, DATE_SUB(NOW(6), INTERVAL 2 DAY), DATE_ADD(NOW(6), INTERVAL 45 DAY), b'1', b'0', NOW(6), NOW(6)),
    ('EXPIRED10', 'Mã đã hết hạn', 'Dữ liệu demo cho trạng thái coupon hết hạn.', 'PERCENT', 10.00, 300000.00, 80000.00, 100, 0, 1, DATE_SUB(NOW(6), INTERVAL 60 DAY), DATE_SUB(NOW(6), INTERVAL 1 DAY), b'1', b'0', NOW(6), NOW(6)),
    ('LIMITED20', 'Giảm 20% số lượng có hạn', 'Dữ liệu demo cho coupon đã dùng hết lượt.', 'PERCENT', 20.00, 2000000.00, 300000.00, 1, 1, 1, DATE_SUB(NOW(6), INTERVAL 1 DAY), DATE_ADD(NOW(6), INTERVAL 14 DAY), b'1', b'0', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE
    name = VALUES(name), description = VALUES(description), discount_type = VALUES(discount_type), discount_value = VALUES(discount_value), min_order_amount = VALUES(min_order_amount), max_discount_amount = VALUES(max_discount_amount), usage_limit = VALUES(usage_limit), used_count = VALUES(used_count), per_user_limit = VALUES(per_user_limit), start_at = VALUES(start_at), end_at = VALUES(end_at), active = VALUES(active), deleted = b'0', updated_at = NOW(6);

-- Make the demo position deterministic.  Only one HOME_HERO is active.
UPDATE home_banners SET is_active = b'0' WHERE position IN ('HOME_HERO', 'HOME_SIDE_TOP', 'HOME_SIDE_BOTTOM');
DELETE FROM home_banners WHERE title LIKE '[DEV-SEED]%';

INSERT INTO home_banners (product_id, position, title, subtitle, image_url, mobile_image_url, background_color, sort_order, is_active, starts_at, ends_at, deleted, created_at, updated_at) VALUES
    ((SELECT id FROM products WHERE slug = 'iphone-15-128gb'), 'HOME_HERO', '[DEV-SEED] iPhone 15 đã về', 'Dynamic Island · Camera 48MP · USB-C', NULL, NULL, '#F8FAFC', 0, b'1', DATE_SUB(NOW(6), INTERVAL 1 DAY), DATE_ADD(NOW(6), INTERVAL 90 DAY), b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'tai-nghe-sony-wh-1000xm5'), 'HOME_SIDE_TOP', '[DEV-SEED] Tuần lễ tai nghe', 'Deal đến 22%', NULL, NULL, '#EAF2FF', 0, b'1', DATE_SUB(NOW(6), INTERVAL 1 DAY), DATE_ADD(NOW(6), INTERVAL 90 DAY), b'0', NOW(6), NOW(6)),
    ((SELECT id FROM products WHERE slug = 'asus-zenbook-14-oled'), 'HOME_SIDE_BOTTOM', '[DEV-SEED] Laptop cho mùa tựu trường', 'Ưu đãi đến 10%', NULL, NULL, '#111827', 0, b'1', DATE_SUB(NOW(6), INTERVAL 1 DAY), DATE_ADD(NOW(6), INTERVAL 90 DAY), b'0', NOW(6), NOW(6));

-- -----------------------------------------------------------------------------
-- 4. Addresses and cart for the customer demo account
-- -----------------------------------------------------------------------------
SELECT id INTO @customer_id FROM users WHERE email = 'customer@example.com';
SELECT id INTO @linh_id FROM users WHERE email = 'linh.nguyen@example.com';

-- Remove seed orders before replacing their referenced addresses.
DELETE prm FROM product_review_media prm
JOIN product_reviews pr ON pr.review_id = prm.review_id
JOIN order_items oi ON oi.order_item_id = pr.order_item_id
JOIN orders o ON o.order_id = oi.order_id
WHERE o.note LIKE '[DEV-SEED]%';
DELETE pr FROM product_reviews pr
JOIN order_items oi ON oi.order_item_id = pr.order_item_id
JOIN orders o ON o.order_id = oi.order_id
WHERE o.note LIKE '[DEV-SEED]%';
DELETE h FROM order_status_history h JOIN orders o ON o.order_id = h.order_id WHERE o.note LIKE '[DEV-SEED]%';
DELETE cu FROM coupon_usages cu JOIN orders o ON o.order_id = cu.order_id WHERE o.note LIKE '[DEV-SEED]%';
DELETE pay FROM payments pay JOIN orders o ON o.order_id = pay.order_id WHERE o.note LIKE '[DEV-SEED]%';
DELETE oi FROM order_items oi JOIN orders o ON o.order_id = oi.order_id WHERE o.note LIKE '[DEV-SEED]%';
DELETE FROM orders WHERE note LIKE '[DEV-SEED]%';

UPDATE addresses SET is_default = b'0' WHERE user_id IN (@customer_id, @linh_id);
DELETE FROM addresses WHERE user_id IN (@customer_id, @linh_id);

INSERT INTO addresses (user_id, recipient_name, phone_number, province_name, district_name, ward_name, full_address, address_type, is_default, is_deleted, created_at, updated_at) VALUES
    (@customer_id, 'Nguyễn Minh Anh', '0900000002', 'Thành phố Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 'Số 123, Đường Lê Lợi', 'HOME', b'1', b'0', NOW(6), NOW(6)),
    (@customer_id, 'Nguyễn Minh Anh', '0900000002', 'Thành phố Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', 'Tầng 8, Tòa nhà Nexa', 'OFFICE', b'0', b'0', NOW(6), NOW(6)),
    (@linh_id, 'Nguyễn Thùy Linh', '0900000003', 'Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', 'Số 45, Đường Võ Văn Tần', 'HOME', b'1', b'0', NOW(6), NOW(6));

INSERT INTO carts (user_id, status, created_at, updated_at)
VALUES (@customer_id, 'ACTIVE', NOW(6), NOW(6))
ON DUPLICATE KEY UPDATE status = 'ACTIVE', updated_at = NOW(6);

SELECT cart_id INTO @customer_cart_id FROM carts WHERE user_id = @customer_id;
DELETE FROM cart_items WHERE cart_id = @customer_cart_id;
INSERT INTO cart_items (cart_id, product_variant_id, quantity, unit_price, created_at, updated_at) VALUES
    (@customer_cart_id, (SELECT id FROM product_variants WHERE sku = 'SAM-S24-256-ONYX'), 1, 18490000.00, NOW(6), NOW(6)),
    (@customer_cart_id, (SELECT id FROM product_variants WHERE sku = 'SNY-WH1000XM5-BLK'), 1, 6990000.00, NOW(6), NOW(6));

-- -----------------------------------------------------------------------------
-- 5. Orders, history, payments, coupon usage and reviews
-- -----------------------------------------------------------------------------
SELECT address_id INTO @customer_address_id FROM addresses WHERE user_id = @customer_id AND is_default = b'1' ORDER BY address_id DESC LIMIT 1;
SELECT address_id INTO @linh_address_id FROM addresses WHERE user_id = @linh_id AND is_default = b'1' ORDER BY address_id DESC LIMIT 1;
SELECT coupon_id INTO @nexa5_coupon_id FROM coupon WHERE code = 'NEXA5';

INSERT INTO orders (user_id, address_id, coupon_id, recipient_name, phone_number, shipping_address, status, payment_status, shipping_status, subtotal_amount, shipping_fee, discount_amount, total_amount, note, created_at, updated_at) VALUES
    (@customer_id, @customer_address_id, @nexa5_coupon_id, 'Nguyễn Minh Anh', '0900000002', 'Số 123, Đường Lê Lợi, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 'COMPLETED', 'PAID', 'DELIVERED', 19990000.00, 0.00, 100000.00, 19890000.00, '[DEV-SEED] Completed order for review', DATE_SUB(NOW(6), INTERVAL 14 DAY), DATE_SUB(NOW(6), INTERVAL 8 DAY)),
    (@customer_id, @customer_address_id, NULL, 'Nguyễn Minh Anh', '0900000002', 'Số 123, Đường Lê Lợi, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', 'SHIPPING', 'UNPAID', 'SHIPPING', 6990000.00, 30000.00, 0.00, 7020000.00, '[DEV-SEED] Shipping order', DATE_SUB(NOW(6), INTERVAL 2 DAY), NOW(6)),
    (@linh_id, @linh_address_id, NULL, 'Nguyễn Thùy Linh', '0900000003', 'Số 45, Đường Võ Văn Tần, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội', 'CANCELLED', 'CANCELLED', 'CANCELLED', 22490000.00, 0.00, 0.00, 22490000.00, '[DEV-SEED] Cancelled order', DATE_SUB(NOW(6), INTERVAL 6 DAY), DATE_SUB(NOW(6), INTERVAL 5 DAY));

SELECT order_id INTO @completed_order_id FROM orders WHERE note = '[DEV-SEED] Completed order for review';
SELECT order_id INTO @shipping_order_id FROM orders WHERE note = '[DEV-SEED] Shipping order';
SELECT order_id INTO @cancelled_order_id FROM orders WHERE note = '[DEV-SEED] Cancelled order';

INSERT INTO order_items (order_id, product_variant_id, product_name, variant_name, sku, quantity, unit_price, line_total, created_at, updated_at) VALUES
    (@completed_order_id, (SELECT id FROM product_variants WHERE sku = 'APL-IP15-128-BLK'), 'iPhone 15 128GB', '128GB - Đen', 'APL-IP15-128-BLK', 1, 19990000.00, 19990000.00, DATE_SUB(NOW(6), INTERVAL 14 DAY), DATE_SUB(NOW(6), INTERVAL 14 DAY)),
    (@shipping_order_id, (SELECT id FROM product_variants WHERE sku = 'SNY-WH1000XM5-BLK'), 'Tai nghe Sony WH-1000XM5', 'Đen', 'SNY-WH1000XM5-BLK', 1, 6990000.00, 6990000.00, DATE_SUB(NOW(6), INTERVAL 2 DAY), NOW(6)),
    (@cancelled_order_id, (SELECT id FROM product_variants WHERE sku = 'ASU-ZB14-U7-16-512'), 'ASUS Zenbook 14 OLED', 'Core Ultra 7 / 16GB / 512GB', 'ASU-ZB14-U7-16-512', 1, 22490000.00, 22490000.00, DATE_SUB(NOW(6), INTERVAL 6 DAY), DATE_SUB(NOW(6), INTERVAL 5 DAY));

INSERT INTO order_status_history (order_id, changed_by, old_status, new_status, note, created_at) VALUES
    (@completed_order_id, @customer_id, NULL, 'PENDING', 'Customer placed order', DATE_SUB(NOW(6), INTERVAL 14 DAY)),
    (@completed_order_id, (SELECT id FROM users WHERE email = 'admin@gmail.com'), 'PENDING', 'CONFIRMED', 'Order confirmed', DATE_SUB(NOW(6), INTERVAL 13 DAY)),
    (@completed_order_id, (SELECT id FROM users WHERE email = 'admin@gmail.com'), 'CONFIRMED', 'PROCESSING', 'Order is being prepared', DATE_SUB(NOW(6), INTERVAL 12 DAY)),
    (@completed_order_id, (SELECT id FROM users WHERE email = 'admin@gmail.com'), 'PROCESSING', 'SHIPPING', 'Order handed to carrier', DATE_SUB(NOW(6), INTERVAL 11 DAY)),
    (@completed_order_id, @customer_id, 'SHIPPING', 'COMPLETED', 'Customer confirmed receipt', DATE_SUB(NOW(6), INTERVAL 8 DAY)),
    (@shipping_order_id, @customer_id, NULL, 'PENDING', 'Customer placed order', DATE_SUB(NOW(6), INTERVAL 2 DAY)),
    (@shipping_order_id, (SELECT id FROM users WHERE email = 'admin@gmail.com'), 'PENDING', 'CONFIRMED', 'Order confirmed', DATE_SUB(NOW(6), INTERVAL 1 DAY)),
    (@shipping_order_id, (SELECT id FROM users WHERE email = 'admin@gmail.com'), 'CONFIRMED', 'PROCESSING', 'Order is being prepared', DATE_SUB(NOW(6), INTERVAL 12 HOUR)),
    (@shipping_order_id, (SELECT id FROM users WHERE email = 'admin@gmail.com'), 'PROCESSING', 'SHIPPING', 'Order handed to carrier', DATE_SUB(NOW(6), INTERVAL 2 HOUR)),
    (@cancelled_order_id, @linh_id, NULL, 'PENDING', 'Customer placed order', DATE_SUB(NOW(6), INTERVAL 6 DAY)),
    (@cancelled_order_id, @linh_id, 'PENDING', 'CANCELLED', 'Customer requested cancellation', DATE_SUB(NOW(6), INTERVAL 5 DAY));

INSERT INTO payments (order_id, method, status, amount, transaction_code, gateway_response, paid_at, created_at, updated_at) VALUES
    (@completed_order_id, 'BANK_TRANSFER', 'PAID', 19890000.00, 'DEV-TRANSFER-001', '{"source":"development-seed"}', DATE_SUB(NOW(6), INTERVAL 14 DAY), DATE_SUB(NOW(6), INTERVAL 14 DAY), DATE_SUB(NOW(6), INTERVAL 14 DAY)),
    (@shipping_order_id, 'COD', 'UNPAID', 7020000.00, NULL, NULL, NULL, DATE_SUB(NOW(6), INTERVAL 2 DAY), NOW(6)),
    (@cancelled_order_id, 'VNPAY', 'CANCELLED', 22490000.00, 'DEV-VNPAY-CANCELLED', '{"source":"development-seed"}', NULL, DATE_SUB(NOW(6), INTERVAL 6 DAY), DATE_SUB(NOW(6), INTERVAL 5 DAY));

INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_amount, status, used_at, reversed_at, created_at)
VALUES (@nexa5_coupon_id, @customer_id, @completed_order_id, 100000.00, 'USED', DATE_SUB(NOW(6), INTERVAL 14 DAY), NULL, DATE_SUB(NOW(6), INTERVAL 14 DAY));

SELECT order_item_id INTO @completed_order_item_id FROM order_items WHERE order_id = @completed_order_id LIMIT 1;
INSERT INTO product_reviews (user_id, product_id, order_item_id, rating, title, content, anonymous, active, deleted, created_at, updated_at)
VALUES (@customer_id, (SELECT id FROM products WHERE slug = 'iphone-15-128gb'), @completed_order_item_id, 5, 'Rất hài lòng', 'Máy đẹp, đóng gói cẩn thận và giao hàng nhanh. Trải nghiệm sử dụng rất tốt.', b'0', b'1', b'0', DATE_SUB(NOW(6), INTERVAL 7 DAY), DATE_SUB(NOW(6), INTERVAL 7 DAY));

SELECT review_id INTO @iphone_review_id FROM product_reviews WHERE order_item_id = @completed_order_item_id;
INSERT INTO product_review_media (review_id, url, media_type, sort_order, created_at, updated_at)
VALUES (@iphone_review_id, 'https://res.cloudinary.com/ddgmxbls3/image/upload/v1782716307/ecommerce/products/fivghhnyypkwakf5b9dg.webp', 'IMAGE', 0, DATE_SUB(NOW(6), INTERVAL 7 DAY), DATE_SUB(NOW(6), INTERVAL 7 DAY));

COMMIT;

-- Quick verification summary.
SELECT 'users' AS entity, COUNT(*) AS seeded_or_existing FROM users WHERE email IN ('admin@gmail.com', 'customer@example.com', 'linh.nguyen@example.com')
UNION ALL SELECT 'products', COUNT(*) FROM products WHERE slug IN ('iphone-15-128gb', 'samsung-galaxy-s24-5g', 'asus-zenbook-14-oled', 'tai-nghe-sony-wh-1000xm5', 'xiaomi-robot-vacuum-s10', 'ipad-air-m2-11-inch', 'macbook-air-m3-13-inch', 'dell-ultrasharp-u2723qe', 'lg-ultragear-27gp850-b', 'logitech-mx-master-3s', 'airpods-pro-2-usb-c', 'keychron-k2-v2')
UNION ALL SELECT 'active_banners', COUNT(*) FROM home_banners WHERE is_active = b'1' AND deleted = b'0'
UNION ALL SELECT 'demo_orders', COUNT(*) FROM orders WHERE note LIKE '[DEV-SEED]%'
UNION ALL SELECT 'reviews', COUNT(*) FROM product_reviews WHERE user_id = @customer_id AND deleted = b'0';
