USE ecommerce_db;

START TRANSACTION;

INSERT INTO roles (name, description) VALUES
('ADMIN', 'System administrator'),
('STAFF', 'Store staff'),
('CUSTOMER', 'Customer account')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO users
(id, email, password, full_name, phone_number, avatar_url, status, is_deleted, created_at, update_at)
VALUES
(1, 'admin@gmail.com', '$2a$10$AguUcuIZPfWOLd5fGNiP1ejTKU1Up7WSZ7ZJZCNbyoAsNSeq9S/ne', 'Admin', '123456789', 'https://example.com/avatars/admin.png', 'ACTIVE', FALSE, NOW(), NOW()),
(2, 'staff01@example.com', '$2a$10$AguUcuIZPfWOLd5fGNiP1ejTKU1Up7WSZ7ZJZCNbyoAsNSeq9S/ne', 'Store Staff', '0901000001', 'https://example.com/avatars/staff01.png', 'ACTIVE', FALSE, NOW(), NOW()),
(3, 'minh.nguyen@example.com', '$2a$10$AguUcuIZPfWOLd5fGNiP1ejTKU1Up7WSZ7ZJZCNbyoAsNSeq9S/ne', 'Minh Nguyen', '0901000002', 'https://example.com/avatars/minh.png', 'ACTIVE', FALSE, NOW(), NOW()),
(4, 'linh.tran@example.com', '$2a$10$AguUcuIZPfWOLd5fGNiP1ejTKU1Up7WSZ7ZJZCNbyoAsNSeq9S/ne', 'Linh Tran', '0901000003', 'https://example.com/avatars/linh.png', 'ACTIVE', FALSE, NOW(), NOW()),
(5, 'khoa.pham@example.com', '$2a$10$AguUcuIZPfWOLd5fGNiP1ejTKU1Up7WSZ7ZJZCNbyoAsNSeq9S/ne', 'Khoa Pham', '0901000004', 'https://example.com/avatars/khoa.png', 'ACTIVE', FALSE, NOW(), NOW()),
(6, 'mai.le@example.com', '$2a$10$AguUcuIZPfWOLd5fGNiP1ejTKU1Up7WSZ7ZJZCNbyoAsNSeq9S/ne', 'Mai Le', '0901000005', 'https://example.com/avatars/mai.png', 'ACTIVE', FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE
password = VALUES(password),
full_name = VALUES(full_name),
phone_number = VALUES(phone_number),
avatar_url = VALUES(avatar_url),
status = VALUES(status),
is_deleted = VALUES(is_deleted),
update_at = NOW();

INSERT INTO users_roles (user_id, role_name) VALUES
(1, 'ADMIN'),
(2, 'STAFF'),
(3, 'CUSTOMER'),
(4, 'CUSTOMER'),
(5, 'CUSTOMER'),
(6, 'CUSTOMER')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

INSERT INTO brands
(id, name, slug, logo_url, active, deleted, created_at, update_at)
VALUES
(1, 'Apple', 'apple', 'https://example.com/brands/apple.png', TRUE, FALSE, NOW(), NOW()),
(2, 'Samsung', 'samsung', 'https://example.com/brands/samsung.png', TRUE, FALSE, NOW(), NOW()),
(3, 'Dell', 'dell', 'https://example.com/brands/dell.png', TRUE, FALSE, NOW(), NOW()),
(4, 'Asus', 'asus', 'https://example.com/brands/asus.png', TRUE, FALSE, NOW(), NOW()),
(5, 'Sony', 'sony', 'https://example.com/brands/sony.png', TRUE, FALSE, NOW(), NOW()),
(6, 'Logitech', 'logitech', 'https://example.com/brands/logitech.png', TRUE, FALSE, NOW(), NOW()),
(7, 'Anker', 'anker', 'https://example.com/brands/anker.png', TRUE, FALSE, NOW(), NOW()),
(8, 'Xiaomi', 'xiaomi', 'https://example.com/brands/xiaomi.png', TRUE, FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE
name = VALUES(name),
logo_url = VALUES(logo_url),
active = VALUES(active),
deleted = VALUES(deleted),
update_at = NOW();

INSERT INTO category
(id, name, slug, description, active, deleted, parent_id, created_at, updated_at)
VALUES
(1, 'Phones', 'phones', 'Smartphones and mobile accessories.', TRUE, FALSE, NULL, NOW(), NOW()),
(2, 'Laptops', 'laptops', 'Laptop computers for work, study, and gaming.', TRUE, FALSE, NULL, NOW(), NOW()),
(3, 'Audio', 'audio', 'Headphones, earbuds, and speakers.', TRUE, FALSE, NULL, NOW(), NOW()),
(4, 'Accessories', 'accessories', 'Computer and mobile accessories.', TRUE, FALSE, NULL, NOW(), NOW()),
(5, 'Smart Home', 'smart-home', 'Smart home devices and IoT products.', TRUE, FALSE, NULL, NOW(), NOW()),
(6, 'iPhone', 'iphone', 'Apple iPhone models.', TRUE, FALSE, 1, NOW(), NOW()),
(7, 'Android Phones', 'android-phones', 'Android smartphone models.', TRUE, FALSE, 1, NOW(), NOW()),
(8, 'Ultrabooks', 'ultrabooks', 'Thin and light laptops.', TRUE, FALSE, 2, NOW(), NOW()),
(9, 'Gaming Laptops', 'gaming-laptops', 'High performance gaming laptops.', TRUE, FALSE, 2, NOW(), NOW()),
(10, 'Earbuds', 'earbuds', 'Wireless earbuds and in-ear headphones.', TRUE, FALSE, 3, NOW(), NOW()),
(11, 'Headphones', 'headphones', 'Over-ear and on-ear headphones.', TRUE, FALSE, 3, NOW(), NOW()),
(12, 'Keyboards', 'keyboards', 'Mechanical and wireless keyboards.', TRUE, FALSE, 4, NOW(), NOW()),
(13, 'Mice', 'mice', 'Wireless and gaming mice.', TRUE, FALSE, 4, NOW(), NOW()),
(14, 'Chargers', 'chargers', 'Adapters, cables, and power banks.', TRUE, FALSE, 4, NOW(), NOW()),
(15, 'Cameras', 'cameras', 'Security cameras and smart cameras.', TRUE, FALSE, 5, NOW(), NOW()),
(16, 'Lighting', 'lighting', 'Smart bulbs and lighting kits.', TRUE, FALSE, 5, NOW(), NOW())
ON DUPLICATE KEY UPDATE
name = VALUES(name),
description = VALUES(description),
active = VALUES(active),
deleted = VALUES(deleted),
parent_id = VALUES(parent_id),
updated_at = NOW();

INSERT INTO products
(id, name, slug, short_description, description, brand_id, active, deleted, category_id, created_at, update_at)
VALUES
(1, 'iPhone 15 128GB', 'iphone-15-128gb', 'A16 chip, OLED display, dual camera.', 'iPhone 15 with 128GB storage, USB-C, and excellent daily performance.', 1, TRUE, FALSE, 6, NOW(), NOW()),
(2, 'iPhone 15 Pro 256GB', 'iphone-15-pro-256gb', 'Titanium body and A17 Pro chip.', 'Premium iPhone with Pro camera system and strong gaming performance.', 1, TRUE, FALSE, 6, NOW(), NOW()),
(3, 'Samsung Galaxy S24 256GB', 'samsung-galaxy-s24-256gb', 'Compact flagship Android phone.', 'Galaxy S24 with bright display, AI features, and reliable camera.', 2, TRUE, FALSE, 7, NOW(), NOW()),
(4, 'Samsung Galaxy A55 128GB', 'samsung-galaxy-a55-128gb', 'Balanced mid-range Android phone.', 'Galaxy A55 with long battery life, AMOLED display, and 5G support.', 2, TRUE, FALSE, 7, NOW(), NOW()),
(5, 'Xiaomi Redmi Note 13 Pro', 'xiaomi-redmi-note-13-pro', 'High value phone with fast charging.', 'Redmi Note 13 Pro for users who want strong specs at a practical price.', 8, TRUE, FALSE, 7, NOW(), NOW()),
(6, 'MacBook Air M3 13 inch', 'macbook-air-m3-13-inch', 'Lightweight laptop with Apple M3.', 'Portable MacBook Air for office work, study, and creative tasks.', 1, TRUE, FALSE, 8, NOW(), NOW()),
(7, 'Dell XPS 13 Plus', 'dell-xps-13-plus', 'Premium Windows ultrabook.', 'Dell XPS 13 Plus with sharp display and compact aluminum design.', 3, TRUE, FALSE, 8, NOW(), NOW()),
(8, 'Asus Zenbook 14 OLED', 'asus-zenbook-14-oled', 'OLED ultrabook with long battery.', 'Asus Zenbook 14 OLED for productivity and entertainment.', 4, TRUE, FALSE, 8, NOW(), NOW()),
(9, 'Asus ROG Strix G16', 'asus-rog-strix-g16', 'Gaming laptop with RTX graphics.', 'ROG Strix G16 for competitive gaming and heavy workloads.', 4, TRUE, FALSE, 9, NOW(), NOW()),
(10, 'Dell Alienware m16', 'dell-alienware-m16', 'High-end gaming laptop.', 'Alienware m16 with powerful CPU and GPU for demanding games.', 3, TRUE, FALSE, 9, NOW(), NOW()),
(11, 'AirPods Pro 2', 'airpods-pro-2', 'Noise cancelling wireless earbuds.', 'AirPods Pro 2 with adaptive audio and MagSafe charging case.', 1, TRUE, FALSE, 10, NOW(), NOW()),
(12, 'Sony WF-1000XM5', 'sony-wf-1000xm5', 'Premium noise cancelling earbuds.', 'Sony wireless earbuds with excellent ANC and detailed sound.', 5, TRUE, FALSE, 10, NOW(), NOW()),
(13, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Wireless ANC over-ear headphones.', 'Comfortable headphones with class-leading noise cancellation.', 5, TRUE, FALSE, 11, NOW(), NOW()),
(14, 'Logitech MX Keys S', 'logitech-mx-keys-s', 'Low-profile wireless keyboard.', 'Quiet keyboard for productivity with multi-device pairing.', 6, TRUE, FALSE, 12, NOW(), NOW()),
(15, 'Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2', 'Lightweight wireless gaming mouse.', 'Pro-grade wireless mouse designed for esports players.', 6, TRUE, FALSE, 13, NOW(), NOW()),
(16, 'Anker 735 Charger 65W', 'anker-735-charger-65w', 'Compact 3-port GaN charger.', 'Fast charger for laptop, tablet, and phone with 65W output.', 7, TRUE, FALSE, 14, NOW(), NOW()),
(17, 'Anker PowerCore 20000', 'anker-powercore-20000', 'High capacity power bank.', 'Portable battery pack with USB-C fast charging.', 7, TRUE, FALSE, 14, NOW(), NOW()),
(18, 'Xiaomi Smart Camera C400', 'xiaomi-smart-camera-c400', '2.5K smart security camera.', 'Indoor smart camera with night vision and two-way audio.', 8, TRUE, FALSE, 15, NOW(), NOW()),
(19, 'Xiaomi Smart LED Bulb', 'xiaomi-smart-led-bulb', 'Color smart bulb with app control.', 'Smart LED bulb supporting scenes, schedules, and voice assistants.', 8, TRUE, FALSE, 16, NOW(), NOW()),
(20, 'Samsung Galaxy Buds3 Pro', 'samsung-galaxy-buds3-pro', 'Flagship Samsung earbuds.', 'Wireless earbuds with ANC and smooth Galaxy ecosystem integration.', 2, TRUE, FALSE, 10, NOW(), NOW())
ON DUPLICATE KEY UPDATE
name = VALUES(name),
short_description = VALUES(short_description),
description = VALUES(description),
brand_id = VALUES(brand_id),
active = VALUES(active),
deleted = VALUES(deleted),
category_id = VALUES(category_id),
update_at = NOW();

INSERT INTO product_variants
(id, variant_name, stock_quantity, price, sale_price, currency, sku, active, deleted, created_at, update_at, product_id)
VALUES
(1, 'Black', 35, 21990000, 20790000, 'VND', 'IP15-128-BLK', TRUE, FALSE, NOW(), NOW(), 1),
(2, 'Blue', 28, 21990000, 20790000, 'VND', 'IP15-128-BLU', TRUE, FALSE, NOW(), NOW(), 1),
(3, 'Natural Titanium', 15, 32990000, 31290000, 'VND', 'IP15P-256-NT', TRUE, FALSE, NOW(), NOW(), 2),
(4, 'Black Titanium', 12, 32990000, 31290000, 'VND', 'IP15P-256-BT', TRUE, FALSE, NOW(), NOW(), 2),
(5, 'Onyx Black', 42, 20990000, 19490000, 'VND', 'S24-256-BLK', TRUE, FALSE, NOW(), NOW(), 3),
(6, 'Marble Gray', 31, 20990000, 19490000, 'VND', 'S24-256-GRY', TRUE, FALSE, NOW(), NOW(), 3),
(7, 'Awesome Navy', 60, 9990000, 9290000, 'VND', 'A55-128-NAVY', TRUE, FALSE, NOW(), NOW(), 4),
(8, 'Awesome Lilac', 48, 9990000, 9290000, 'VND', 'A55-128-LILAC', TRUE, FALSE, NOW(), NOW(), 4),
(9, 'Midnight Black', 55, 7490000, 6990000, 'VND', 'RN13P-BLK', TRUE, FALSE, NOW(), NOW(), 5),
(10, 'Ocean Teal', 46, 7490000, 6990000, 'VND', 'RN13P-TEAL', TRUE, FALSE, NOW(), NOW(), 5),
(11, '8GB RAM 256GB SSD', 24, 27990000, 26790000, 'VND', 'MBA-M3-13-8-256', TRUE, FALSE, NOW(), NOW(), 6),
(12, '16GB RAM 512GB SSD', 14, 35990000, 34290000, 'VND', 'MBA-M3-13-16-512', TRUE, FALSE, NOW(), NOW(), 6),
(13, '16GB RAM 512GB SSD', 11, 39990000, 37990000, 'VND', 'XPS13P-16-512', TRUE, FALSE, NOW(), NOW(), 7),
(14, '32GB RAM 1TB SSD', 7, 52990000, 49990000, 'VND', 'XPS13P-32-1TB', TRUE, FALSE, NOW(), NOW(), 7),
(15, 'Core Ultra 5 16GB 512GB', 22, 24990000, 23290000, 'VND', 'ZEN14-OLED-U5', TRUE, FALSE, NOW(), NOW(), 8),
(16, 'Core Ultra 7 32GB 1TB', 10, 33990000, 31990000, 'VND', 'ZEN14-OLED-U7', TRUE, FALSE, NOW(), NOW(), 8),
(17, 'RTX 4060 16GB 1TB', 9, 39990000, 37990000, 'VND', 'ROG-G16-4060', TRUE, FALSE, NOW(), NOW(), 9),
(18, 'RTX 4070 32GB 1TB', 5, 52990000, 49990000, 'VND', 'ROG-G16-4070', TRUE, FALSE, NOW(), NOW(), 9),
(19, 'RTX 4070 32GB 1TB', 4, 59990000, 56990000, 'VND', 'AW-M16-4070', TRUE, FALSE, NOW(), NOW(), 10),
(20, 'RTX 4080 32GB 2TB', 2, 79990000, 75990000, 'VND', 'AW-M16-4080', TRUE, FALSE, NOW(), NOW(), 10),
(21, 'White', 38, 6490000, 5990000, 'VND', 'APP2-WHT', TRUE, FALSE, NOW(), NOW(), 11),
(22, 'Black', 21, 6490000, 5990000, 'VND', 'APP2-BLK', TRUE, FALSE, NOW(), NOW(), 11),
(23, 'Silver', 26, 6990000, 6490000, 'VND', 'WF1000XM5-SLV', TRUE, FALSE, NOW(), NOW(), 12),
(24, 'Black', 30, 6990000, 6490000, 'VND', 'WF1000XM5-BLK', TRUE, FALSE, NOW(), NOW(), 12),
(25, 'Black', 18, 8990000, 8290000, 'VND', 'WH1000XM5-BLK', TRUE, FALSE, NOW(), NOW(), 13),
(26, 'Silver', 16, 8990000, 8290000, 'VND', 'WH1000XM5-SLV', TRUE, FALSE, NOW(), NOW(), 13),
(27, 'Graphite', 34, 2890000, 2590000, 'VND', 'MXKEYSS-GRAPH', TRUE, FALSE, NOW(), NOW(), 14),
(28, 'Pale Gray', 22, 2890000, 2590000, 'VND', 'MXKEYSS-GRAY', TRUE, FALSE, NOW(), NOW(), 14),
(29, 'Black', 45, 3290000, 2990000, 'VND', 'GPROXSL2-BLK', TRUE, FALSE, NOW(), NOW(), 15),
(30, 'White', 37, 3290000, 2990000, 'VND', 'GPROXSL2-WHT', TRUE, FALSE, NOW(), NOW(), 15),
(31, 'Black', 70, 1290000, 1090000, 'VND', 'ANK735-BLK', TRUE, FALSE, NOW(), NOW(), 16),
(32, 'White', 64, 1290000, 1090000, 'VND', 'ANK735-WHT', TRUE, FALSE, NOW(), NOW(), 16),
(33, 'Black', 50, 1590000, 1390000, 'VND', 'ANK-PC20K-BLK', TRUE, FALSE, NOW(), NOW(), 17),
(34, 'White', 44, 1590000, 1390000, 'VND', 'ANK-PC20K-WHT', TRUE, FALSE, NOW(), NOW(), 17),
(35, 'White', 33, 1190000, 990000, 'VND', 'XMC400-WHT', TRUE, FALSE, NOW(), NOW(), 18),
(36, 'Black', 27, 1190000, 990000, 'VND', 'XMC400-BLK', TRUE, FALSE, NOW(), NOW(), 18),
(37, 'E27 Color', 80, 399000, 329000, 'VND', 'XMBULB-E27-COLOR', TRUE, FALSE, NOW(), NOW(), 19),
(38, 'E27 Warm White', 75, 299000, 249000, 'VND', 'XMBULB-E27-WARM', TRUE, FALSE, NOW(), NOW(), 19),
(39, 'Silver', 25, 5790000, 5290000, 'VND', 'BUDS3P-SLV', TRUE, FALSE, NOW(), NOW(), 20),
(40, 'White', 20, 5790000, 5290000, 'VND', 'BUDS3P-WHT', TRUE, FALSE, NOW(), NOW(), 20)
ON DUPLICATE KEY UPDATE
variant_name = VALUES(variant_name),
stock_quantity = VALUES(stock_quantity),
price = VALUES(price),
sale_price = VALUES(sale_price),
currency = VALUES(currency),
active = VALUES(active),
deleted = VALUES(deleted),
product_id = VALUES(product_id),
update_at = NOW();

INSERT INTO product_media
(id, url, media_type, is_thumbnail, sort_order, alt_text, active, deleted, product_id, created_at, updated_at)
VALUES
(1, 'https://example.com/products/iphone-15-1.jpg', 'IMAGE', TRUE, 1, 'iPhone 15 product image', TRUE, FALSE, 1, NOW(), NOW()),
(2, 'https://example.com/products/iphone-15-pro-1.jpg', 'IMAGE', TRUE, 1, 'iPhone 15 Pro product image', TRUE, FALSE, 2, NOW(), NOW()),
(3, 'https://example.com/products/galaxy-s24-1.jpg', 'IMAGE', TRUE, 1, 'Galaxy S24 product image', TRUE, FALSE, 3, NOW(), NOW()),
(4, 'https://example.com/products/galaxy-a55-1.jpg', 'IMAGE', TRUE, 1, 'Galaxy A55 product image', TRUE, FALSE, 4, NOW(), NOW()),
(5, 'https://example.com/products/redmi-note-13-pro-1.jpg', 'IMAGE', TRUE, 1, 'Redmi Note 13 Pro product image', TRUE, FALSE, 5, NOW(), NOW()),
(6, 'https://example.com/products/macbook-air-m3-1.jpg', 'IMAGE', TRUE, 1, 'MacBook Air M3 product image', TRUE, FALSE, 6, NOW(), NOW()),
(7, 'https://example.com/products/dell-xps-13-plus-1.jpg', 'IMAGE', TRUE, 1, 'Dell XPS 13 Plus product image', TRUE, FALSE, 7, NOW(), NOW()),
(8, 'https://example.com/products/zenbook-14-oled-1.jpg', 'IMAGE', TRUE, 1, 'Asus Zenbook 14 OLED product image', TRUE, FALSE, 8, NOW(), NOW()),
(9, 'https://example.com/products/rog-strix-g16-1.jpg', 'IMAGE', TRUE, 1, 'Asus ROG Strix G16 product image', TRUE, FALSE, 9, NOW(), NOW()),
(10, 'https://example.com/products/alienware-m16-1.jpg', 'IMAGE', TRUE, 1, 'Dell Alienware m16 product image', TRUE, FALSE, 10, NOW(), NOW()),
(11, 'https://example.com/products/airpods-pro-2-1.jpg', 'IMAGE', TRUE, 1, 'AirPods Pro 2 product image', TRUE, FALSE, 11, NOW(), NOW()),
(12, 'https://example.com/products/sony-wf-1000xm5-1.jpg', 'IMAGE', TRUE, 1, 'Sony WF-1000XM5 product image', TRUE, FALSE, 12, NOW(), NOW()),
(13, 'https://example.com/products/sony-wh-1000xm5-1.jpg', 'IMAGE', TRUE, 1, 'Sony WH-1000XM5 product image', TRUE, FALSE, 13, NOW(), NOW()),
(14, 'https://example.com/products/logitech-mx-keys-s-1.jpg', 'IMAGE', TRUE, 1, 'Logitech MX Keys S product image', TRUE, FALSE, 14, NOW(), NOW()),
(15, 'https://example.com/products/g-pro-x-superlight-2-1.jpg', 'IMAGE', TRUE, 1, 'Logitech G Pro X Superlight 2 product image', TRUE, FALSE, 15, NOW(), NOW()),
(16, 'https://example.com/products/anker-735-1.jpg', 'IMAGE', TRUE, 1, 'Anker 735 Charger product image', TRUE, FALSE, 16, NOW(), NOW()),
(17, 'https://example.com/products/anker-powercore-20000-1.jpg', 'IMAGE', TRUE, 1, 'Anker PowerCore 20000 product image', TRUE, FALSE, 17, NOW(), NOW()),
(18, 'https://example.com/products/xiaomi-camera-c400-1.jpg', 'IMAGE', TRUE, 1, 'Xiaomi Smart Camera C400 product image', TRUE, FALSE, 18, NOW(), NOW()),
(19, 'https://example.com/products/xiaomi-smart-led-bulb-1.jpg', 'IMAGE', TRUE, 1, 'Xiaomi Smart LED Bulb product image', TRUE, FALSE, 19, NOW(), NOW()),
(20, 'https://example.com/products/galaxy-buds3-pro-1.jpg', 'IMAGE', TRUE, 1, 'Samsung Galaxy Buds3 Pro product image', TRUE, FALSE, 20, NOW(), NOW())
ON DUPLICATE KEY UPDATE
url = VALUES(url),
media_type = VALUES(media_type),
is_thumbnail = VALUES(is_thumbnail),
sort_order = VALUES(sort_order),
alt_text = VALUES(alt_text),
active = VALUES(active),
deleted = VALUES(deleted),
product_id = VALUES(product_id),
updated_at = NOW();

INSERT INTO coupon
(coupon_id, code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, per_user_limit, start_at, end_at, active, deleted, created_at, updated_at)
VALUES
(1, 'WELCOME10', 'Welcome 10 percent', 'Discount for new customers.', 'PERCENT', 10.00, 500000.00, 300000.00, 500, 12, 1, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), TRUE, FALSE, NOW(), NOW()),
(2, 'FREESHIP50', 'Shipping support', 'Fixed discount for shipping fee.', 'FIXED_AMOUNT', 50000.00, 300000.00, 50000.00, 1000, 85, 3, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), TRUE, FALSE, NOW(), NOW()),
(3, 'LAPTOP500K', 'Laptop sale', 'Fixed discount for laptop orders.', 'FIXED_AMOUNT', 500000.00, 15000000.00, 500000.00, 200, 19, 1, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY), TRUE, FALSE, NOW(), NOW()),
(4, 'AUDIO15', 'Audio deal', 'Discount for audio products.', 'PERCENT', 15.00, 1000000.00, 400000.00, 300, 41, 2, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, FALSE, NOW(), NOW()),
(5, 'PHONE5', 'Phone flash sale', 'Small discount for phone orders.', 'PERCENT', 5.00, 3000000.00, 600000.00, 400, 97, 1, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), TRUE, FALSE, NOW(), NOW()),
(6, 'OLD2024', 'Expired old campaign', 'Inactive example coupon.', 'FIXED_AMOUNT', 100000.00, 1000000.00, 100000.00, 100, 100, 1, DATE_SUB(NOW(), INTERVAL 180 DAY), DATE_SUB(NOW(), INTERVAL 90 DAY), FALSE, FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE
name = VALUES(name),
description = VALUES(description),
discount_type = VALUES(discount_type),
discount_value = VALUES(discount_value),
min_order_amount = VALUES(min_order_amount),
max_discount_amount = VALUES(max_discount_amount),
usage_limit = VALUES(usage_limit),
used_count = VALUES(used_count),
per_user_limit = VALUES(per_user_limit),
start_at = VALUES(start_at),
end_at = VALUES(end_at),
active = VALUES(active),
deleted = VALUES(deleted),
updated_at = NOW();

INSERT INTO addresses
(address_id, user_id, recipient_name, phone_number, province_name, district_name, ward_name, full_address, address_type, is_default, is_deleted, created_at, updated_at)
VALUES
(1, 3, 'Minh Nguyen', '0901000002', 'Ho Chi Minh', 'District 1', 'Ben Nghe', '12 Nguyen Hue Street', 'HOME', TRUE, FALSE, NOW(), NOW()),
(2, 3, 'Minh Nguyen', '0901000002', 'Ho Chi Minh', 'Thu Duc City', 'Linh Trung', '45 Vo Van Ngan Street', 'OFFICE', FALSE, FALSE, NOW(), NOW()),
(3, 4, 'Linh Tran', '0901000003', 'Ha Noi', 'Cau Giay', 'Dich Vong', '89 Tran Thai Tong Street', 'HOME', TRUE, FALSE, NOW(), NOW()),
(4, 5, 'Khoa Pham', '0901000004', 'Da Nang', 'Hai Chau', 'Hai Chau I', '21 Bach Dang Street', 'HOME', TRUE, FALSE, NOW(), NOW()),
(5, 6, 'Mai Le', '0901000005', 'Can Tho', 'Ninh Kieu', 'An Khanh', '08 Nguyen Van Cu Street', 'HOME', TRUE, FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE
user_id = VALUES(user_id),
recipient_name = VALUES(recipient_name),
phone_number = VALUES(phone_number),
province_name = VALUES(province_name),
district_name = VALUES(district_name),
ward_name = VALUES(ward_name),
full_address = VALUES(full_address),
address_type = VALUES(address_type),
is_default = VALUES(is_default),
is_deleted = VALUES(is_deleted),
updated_at = NOW();

INSERT INTO carts
(cart_id, user_id, status, created_at, updated_at)
VALUES
(1, 3, 'ACTIVE', NOW(), NOW()),
(2, 4, 'ACTIVE', NOW(), NOW()),
(3, 5, 'ACTIVE', NOW(), NOW()),
(4, 6, 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE
user_id = VALUES(user_id),
status = VALUES(status),
updated_at = NOW();

INSERT INTO cart_items
(cart_item_id, cart_id, product_variant_id, quantity, unit_price, created_at, updated_at)
VALUES
(1, 1, 21, 1, 5990000.00, NOW(), NOW()),
(2, 1, 31, 2, 1090000.00, NOW(), NOW()),
(3, 2, 5, 1, 19490000.00, NOW(), NOW()),
(4, 2, 27, 1, 2590000.00, NOW(), NOW()),
(5, 3, 35, 1, 990000.00, NOW(), NOW()),
(6, 3, 37, 3, 329000.00, NOW(), NOW()),
(7, 4, 23, 1, 6490000.00, NOW(), NOW()),
(8, 4, 33, 1, 1390000.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE
cart_id = VALUES(cart_id),
product_variant_id = VALUES(product_variant_id),
quantity = VALUES(quantity),
unit_price = VALUES(unit_price),
updated_at = NOW();

INSERT INTO orders
(order_id, user_id, address_id, coupon_id, recipient_name, phone_number, shipping_address, status, payment_status, shipping_status, subtotal_amount, shipping_fee, discount_amount, total_amount, note, created_at, updated_at)
VALUES
(1, 3, 1, 1, 'Minh Nguyen', '0901000002', '12 Nguyen Hue Street, Ben Nghe, District 1, Ho Chi Minh', 'COMPLETED', 'PAID', 'DELIVERED', 20790000.00, 30000.00, 300000.00, 20520000.00, 'Delivered successfully.', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 16 DAY)),
(2, 4, 3, 4, 'Linh Tran', '0901000003', '89 Tran Thai Tong Street, Dich Vong, Cau Giay, Ha Noi', 'SHIPPING', 'PAID', 'SHIPPING', 12480000.00, 30000.00, 400000.00, 12110000.00, 'Call before delivery.', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(3, 5, 4, 2, 'Khoa Pham', '0901000004', '21 Bach Dang Street, Hai Chau I, Hai Chau, Da Nang', 'PROCESSING', 'UNPAID', 'PREPARING', 1319000.00, 50000.00, 50000.00, 1319000.00, 'Customer will pay on delivery.', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(4, 6, 5, 3, 'Mai Le', '0901000005', '08 Nguyen Van Cu Street, An Khanh, Ninh Kieu, Can Tho', 'CONFIRMED', 'PAID', 'NOT_SHIPPED', 34290000.00, 0.00, 500000.00, 33790000.00, 'Laptop order.', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW())
ON DUPLICATE KEY UPDATE
user_id = VALUES(user_id),
address_id = VALUES(address_id),
coupon_id = VALUES(coupon_id),
recipient_name = VALUES(recipient_name),
phone_number = VALUES(phone_number),
shipping_address = VALUES(shipping_address),
status = VALUES(status),
payment_status = VALUES(payment_status),
shipping_status = VALUES(shipping_status),
subtotal_amount = VALUES(subtotal_amount),
shipping_fee = VALUES(shipping_fee),
discount_amount = VALUES(discount_amount),
total_amount = VALUES(total_amount),
note = VALUES(note),
updated_at = NOW();

INSERT INTO order_items
(order_item_id, order_id, product_variant_id, product_name, variant_name, sku, quantity, unit_price, line_total, created_at, updated_at)
VALUES
(1, 1, 1, 'iPhone 15 128GB', 'Black', 'IP15-128-BLK', 1, 20790000.00, 20790000.00, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 2, 23, 'Sony WF-1000XM5', 'Silver', 'WF1000XM5-SLV', 1, 6490000.00, 6490000.00, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 2, 25, 'Sony WH-1000XM5', 'Black', 'WH1000XM5-BLK', 1, 8290000.00, 8290000.00, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 3, 35, 'Xiaomi Smart Camera C400', 'White', 'XMC400-WHT', 1, 990000.00, 990000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 3, 37, 'Xiaomi Smart LED Bulb', 'E27 Color', 'XMBULB-E27-COLOR', 1, 329000.00, 329000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 4, 12, 'MacBook Air M3 13 inch', '16GB RAM 512GB SSD', 'MBA-M3-13-16-512', 1, 34290000.00, 34290000.00, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE
order_id = VALUES(order_id),
product_variant_id = VALUES(product_variant_id),
product_name = VALUES(product_name),
variant_name = VALUES(variant_name),
sku = VALUES(sku),
quantity = VALUES(quantity),
unit_price = VALUES(unit_price),
line_total = VALUES(line_total),
updated_at = NOW();

COMMIT;
