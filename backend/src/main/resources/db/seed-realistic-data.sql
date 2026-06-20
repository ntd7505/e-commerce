-- Realistic development seed for MySQL 8.
-- Prerequisite: run V1__baseline_schema.sql first.
-- Test accounts use the BCrypt hash for password: password
-- IDs are intentionally kept in the 900xxx range to avoid normal application data.

USE ecommerce_db;
SET NAMES utf8mb4;
SET time_zone = '+07:00';

START TRANSACTION;

-- -----------------------------------------------------------------------------
-- Authorization
-- -----------------------------------------------------------------------------
INSERT INTO permission (name, description) VALUES
    ('PRODUCT_MANAGE', 'Quản lý sản phẩm và tồn kho'),
    ('BRAND_MANAGE', 'Quản lý thương hiệu'),
    ('COUPON_MANAGE', 'Quản lý mã giảm giá'),
    ('ORDER_MANAGE', 'Quản lý đơn hàng'),
    ('USER_MANAGE', 'Quản lý người dùng')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO roles (name, description) VALUES
    ('ADMIN', 'Quản trị viên hệ thống'),
    ('STAFF', 'Nhân viên vận hành cửa hàng'),
    ('CUSTOMER', 'Khách hàng')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT IGNORE INTO roles_permissions (role_name, permissions_name) VALUES
    ('ADMIN', 'PRODUCT_MANAGE'), ('ADMIN', 'BRAND_MANAGE'),
    ('ADMIN', 'COUPON_MANAGE'), ('ADMIN', 'ORDER_MANAGE'), ('ADMIN', 'USER_MANAGE'),
    ('STAFF', 'PRODUCT_MANAGE'), ('STAFF', 'BRAND_MANAGE'),
    ('STAFF', 'COUPON_MANAGE'), ('STAFF', 'ORDER_MANAGE');

INSERT INTO users
    (id, email, password, full_name, phone_number, avatar_url, status, is_deleted, created_at, update_at)
VALUES
    (900001, 'staff.seed@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Nguyễn Minh Anh', '0901000001', 'https://i.pravatar.cc/300?img=47', 'ACTIVE', 0, NOW(), NOW()),
    (900002, 'lan.nguyen.seed@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Nguyễn Thị Lan', '0901000002', 'https://i.pravatar.cc/300?img=32', 'ACTIVE', 0, NOW(), NOW()),
    (900003, 'huy.tran.seed@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Trần Quốc Huy', '0901000003', 'https://i.pravatar.cc/300?img=12', 'ACTIVE', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name), avatar_url = VALUES(avatar_url), status = VALUES(status),
    is_deleted = VALUES(is_deleted), update_at = NOW();

INSERT IGNORE INTO users_roles (user_id, role_name) VALUES
    (900001, 'STAFF'), (900002, 'CUSTOMER'), (900003, 'CUSTOMER');

-- -----------------------------------------------------------------------------
-- Customer addresses
-- -----------------------------------------------------------------------------
INSERT INTO addresses
    (address_id, user_id, recipient_name, phone_number, province_name, district_name,
     ward_name, full_address, address_type, is_default, is_deleted, created_at, updated_at)
VALUES
    (900101, 900002, 'Nguyễn Thị Lan', '0901000002', 'Thành phố Hồ Chí Minh',
     'Quận 1', 'Phường Bến Nghé', '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
     'HOME', 1, 0, NOW(), NOW()),
    (900102, 900002, 'Nguyễn Thị Lan', '0901000002', 'Thành phố Hồ Chí Minh',
     'Quận 3', 'Phường Võ Thị Sáu', '125 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh',
     'OFFICE', 0, 0, NOW(), NOW()),
    (900103, 900003, 'Trần Quốc Huy', '0901000003', 'Thành phố Hà Nội',
     'Quận Cầu Giấy', 'Phường Dịch Vọng', '88 Trần Thái Tông, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội',
     'HOME', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    recipient_name = VALUES(recipient_name), phone_number = VALUES(phone_number),
    full_address = VALUES(full_address), is_default = VALUES(is_default),
    is_deleted = VALUES(is_deleted), updated_at = NOW();

-- -----------------------------------------------------------------------------
-- Catalog hierarchy
-- -----------------------------------------------------------------------------
INSERT INTO category
    (id, name, slug, description, active, deleted, parent_id, created_at, updated_at)
VALUES
    (900201, 'Điện thoại - Máy tính bảng', 'dien-thoai-may-tinh-bang',
     'Điện thoại thông minh và máy tính bảng chính hãng', 1, 0, NULL, NOW(), NOW()),
    (900202, 'Điện thoại thông minh', 'dien-thoai-thong-minh',
     'Smartphone iOS và Android', 1, 0, 900201, NOW(), NOW()),
    (900203, 'Laptop - Máy vi tính', 'laptop-may-vi-tinh',
     'Laptop phục vụ học tập, văn phòng và sáng tạo nội dung', 1, 0, NULL, NOW(), NOW()),
    (900204, 'Laptop mỏng nhẹ', 'laptop-mong-nhe',
     'Laptop di động có thời lượng pin tốt', 1, 0, 900203, NOW(), NOW()),
    (900205, 'Phụ kiện công nghệ', 'phu-kien-cong-nghe',
     'Tai nghe, sạc, cáp và phụ kiện chính hãng', 1, 0, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), description = VALUES(description), active = VALUES(active),
    deleted = VALUES(deleted), parent_id = VALUES(parent_id), updated_at = NOW();

INSERT INTO brands (id, name, slug, logo_url, active, deleted, created_at, update_at) VALUES
    (900301, 'Apple', 'apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 1, 0, NOW(), NOW()),
    (900302, 'Samsung', 'samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', 1, 0, NOW(), NOW()),
    (900303, 'ASUS', 'asus', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg', 1, 0, NOW(), NOW()),
    (900304, 'Sony', 'sony', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), logo_url = VALUES(logo_url), active = VALUES(active),
    deleted = VALUES(deleted), update_at = NOW();

INSERT INTO products
    (id, name, slug, short_description, description, brand_id, category_id,
     active, deleted, created_at, update_at)
VALUES
    (900401, 'iPhone 15 128GB', 'iphone-15-128gb',
     'iPhone thế hệ mới với Dynamic Island và cổng USB-C.',
     'Máy sử dụng màn hình Super Retina XDR 6.1 inch, chip A16 Bionic, camera chính 48 MP và kết nối USB-C. Sản phẩm chính hãng, bảo hành 12 tháng.',
     900301, 900202, 1, 0, NOW(), NOW()),
    (900402, 'Samsung Galaxy S24 5G', 'samsung-galaxy-s24-5g',
     'Điện thoại Galaxy AI nhỏ gọn với camera chất lượng cao.',
     'Màn hình Dynamic AMOLED 2X 6.2 inch, bộ nhớ 256 GB, hỗ trợ Galaxy AI và quay video độ phân giải cao.',
     900302, 900202, 1, 0, NOW(), NOW()),
    (900403, 'ASUS Zenbook 14 OLED', 'asus-zenbook-14-oled',
     'Laptop OLED mỏng nhẹ dành cho công việc và học tập.',
     'Màn hình OLED 14 inch, bộ nhớ 16 GB, SSD 512 GB, thiết kế kim loại và thời lượng pin cả ngày.',
     900303, 900204, 1, 0, NOW(), NOW()),
    (900404, 'Tai nghe Sony WH-1000XM5', 'tai-nghe-sony-wh-1000xm5',
     'Tai nghe không dây chống ồn chủ động cao cấp.',
     'Chống ồn thích ứng, đàm thoại rõ nét, kết nối đa thiết bị và thời lượng pin lên đến 30 giờ.',
     900304, 900205, 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), short_description = VALUES(short_description),
    description = VALUES(description), brand_id = VALUES(brand_id), category_id = VALUES(category_id),
    active = VALUES(active), deleted = VALUES(deleted), update_at = NOW();

INSERT INTO product_variants
    (id, product_id, variant_name, stock_quantity, price, sale_price, currency, sku,
     active, deleted, created_at, update_at)
VALUES
    (900501, 900401, '128GB - Đen', 38, 22990000, 19990000, 'VND', 'APL-IP15-128-BLK', 1, 0, NOW(), NOW()),
    (900502, 900401, '128GB - Xanh dương', 24, 22990000, 20490000, 'VND', 'APL-IP15-128-BLU', 1, 0, NOW(), NOW()),
    (900503, 900402, '256GB - Đen Onyx', 31, 22990000, 18490000, 'VND', 'SS-S24-256-BLK', 1, 0, NOW(), NOW()),
    (900504, 900402, '256GB - Tím Cobalt', 19, 22990000, 18490000, 'VND', 'SS-S24-256-VIO', 1, 0, NOW(), NOW()),
    (900505, 900403, 'Core Ultra 5 - 16GB - 512GB', 15, 24990000, 22490000, 'VND', 'AS-ZB14-U5-16-512', 1, 0, NOW(), NOW()),
    (900506, 900404, 'Màu đen', 43, 8490000, 6990000, 'VND', 'SN-WH1000XM5-BLK', 1, 0, NOW(), NOW()),
    (900507, 900404, 'Màu bạc', 27, 8490000, 7190000, 'VND', 'SN-WH1000XM5-SLV', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    variant_name = VALUES(variant_name), stock_quantity = VALUES(stock_quantity),
    price = VALUES(price), sale_price = VALUES(sale_price), currency = VALUES(currency),
    active = VALUES(active), deleted = VALUES(deleted), update_at = NOW();

INSERT INTO product_media
    (id, product_id, url, media_type, is_thumbnail, sort_order, alt_text,
     active, deleted, created_at, updated_at)
VALUES
    (900601, 900401, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'iPhone 15 màu đen', 1, 0, NOW(), NOW()),
    (900602, 900402, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'Samsung Galaxy S24', 1, 0, NOW(), NOW()),
    (900603, 900403, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'ASUS Zenbook 14 OLED', 1, 0, NOW(), NOW()),
    (900604, 900404, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'Tai nghe Sony WH-1000XM5', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    url = VALUES(url), media_type = VALUES(media_type), is_thumbnail = VALUES(is_thumbnail),
    sort_order = VALUES(sort_order), alt_text = VALUES(alt_text), active = VALUES(active),
    deleted = VALUES(deleted), updated_at = NOW();

-- -----------------------------------------------------------------------------
-- Promotions and active carts
-- -----------------------------------------------------------------------------
INSERT INTO coupon
    (coupon_id, code, name, description, discount_type, discount_value,
     min_order_amount, max_discount_amount, usage_limit, used_count, per_user_limit,
     start_at, end_at, active, deleted, created_at, updated_at)
VALUES
    (900701, 'CHAOHE2026', 'Ưu đãi khách hàng mới', 'Giảm 10% tối đa 500.000đ cho đơn từ 1.000.000đ.',
     'PERCENT', 10, 1000000, 500000, 1000, 1, 1,
     '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1, 0, NOW(), NOW()),
    (900702, 'GIAM200K', 'Giảm trực tiếp 200.000đ', 'Áp dụng cho đơn hàng từ 3.000.000đ.',
     'FIXED_AMOUNT', 200000, 3000000, NULL, 500, 0, 2,
     '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), description = VALUES(description), discount_type = VALUES(discount_type),
    discount_value = VALUES(discount_value), min_order_amount = VALUES(min_order_amount),
    max_discount_amount = VALUES(max_discount_amount), usage_limit = VALUES(usage_limit),
    per_user_limit = VALUES(per_user_limit), start_at = VALUES(start_at), end_at = VALUES(end_at),
    active = VALUES(active), deleted = VALUES(deleted), updated_at = NOW();

INSERT INTO carts (cart_id, user_id, status, created_at, updated_at) VALUES
    (900801, 900002, 'ACTIVE', NOW(), NOW()),
    (900802, 900003, 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = NOW();

INSERT INTO cart_items
    (cart_item_id, cart_id, product_variant_id, quantity, unit_price, created_at, updated_at)
VALUES
    (900811, 900801, 900502, 1, 20490000, NOW(), NOW()),
    (900812, 900801, 900506, 1, 6990000, NOW(), NOW()),
    (900813, 900802, 900505, 1, 22490000, NOW(), NOW())
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), unit_price = VALUES(unit_price), updated_at = NOW();

-- -----------------------------------------------------------------------------
-- Completed order, payment, coupon usage, stock ledger and verified review
-- -----------------------------------------------------------------------------
INSERT INTO orders
    (order_id, user_id, address_id, coupon_id, recipient_name, phone_number, shipping_address,
     status, payment_status, shipping_status, subtotal_amount, shipping_fee, discount_amount,
     total_amount, note, cancelled_at, created_at, updated_at)
VALUES
    (900901, 900002, 900101, 900701, 'Nguyễn Thị Lan', '0901000002',
     '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
     'COMPLETED', 'PAID', 'DELIVERED', 19990000, 0, 500000, 19490000,
     'Giao giờ hành chính, gọi trước khi đến.', NULL,
     '2026-06-02 09:15:00', '2026-06-05 16:40:00'),
    (900902, 900003, 900103, NULL, 'Trần Quốc Huy', '0901000003',
     '88 Trần Thái Tông, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội',
     'CANCELLED', 'CANCELLED', 'CANCELLED', 6990000, 0, 0, 6990000,
     'Nhận hàng vào buổi tối.', '2026-06-12 10:30:00',
     '2026-06-11 20:10:00', '2026-06-12 10:30:00')
ON DUPLICATE KEY UPDATE
    status = VALUES(status), payment_status = VALUES(payment_status),
    shipping_status = VALUES(shipping_status), total_amount = VALUES(total_amount),
    note = VALUES(note), cancelled_at = VALUES(cancelled_at), updated_at = VALUES(updated_at);

INSERT INTO order_items
    (order_item_id, order_id, product_variant_id, product_name, variant_name, sku,
     quantity, unit_price, line_total, created_at, updated_at)
VALUES
    (900911, 900901, 900501, 'iPhone 15 128GB', '128GB - Đen', 'APL-IP15-128-BLK',
     1, 19990000, 19990000, '2026-06-02 09:15:00', '2026-06-02 09:15:00'),
    (900912, 900902, 900506, 'Tai nghe Sony WH-1000XM5', 'Màu đen', 'SN-WH1000XM5-BLK',
     1, 6990000, 6990000, '2026-06-11 20:10:00', '2026-06-12 10:30:00')
ON DUPLICATE KEY UPDATE
    product_name = VALUES(product_name), variant_name = VALUES(variant_name),
    quantity = VALUES(quantity), unit_price = VALUES(unit_price), line_total = VALUES(line_total),
    updated_at = VALUES(updated_at);

INSERT INTO payments
    (payment_id, order_id, method, status, amount, transaction_code, gateway_response,
     paid_at, created_at, updated_at)
VALUES
    (900921, 900901, 'VNPAY', 'PAID', 19490000, 'VNPAY-SEED-900901',
     '{"code":"00","message":"Giao dịch thành công"}',
     '2026-06-02 09:18:00', '2026-06-02 09:16:00', '2026-06-02 09:18:00'),
    (900922, 900902, 'COD', 'CANCELLED', 6990000, NULL, NULL,
     NULL, '2026-06-11 20:10:00', '2026-06-12 10:30:00')
ON DUPLICATE KEY UPDATE
    method = VALUES(method), status = VALUES(status), amount = VALUES(amount),
    transaction_code = VALUES(transaction_code), gateway_response = VALUES(gateway_response),
    paid_at = VALUES(paid_at), updated_at = VALUES(updated_at);

INSERT INTO order_status_history
    (order_status_history_id, order_id, changed_by, old_status, new_status, note, created_at)
VALUES
    (900931, 900901, 900002, NULL, 'PENDING', 'Khách hàng đặt đơn', '2026-06-02 09:15:00'),
    (900932, 900901, 900001, 'PENDING', 'CONFIRMED', 'Đã xác nhận thanh toán', '2026-06-02 09:30:00'),
    (900933, 900901, 900001, 'CONFIRMED', 'PROCESSING', 'Đang đóng gói tại kho', '2026-06-02 14:00:00'),
    (900934, 900901, 900001, 'PROCESSING', 'SHIPPING', 'Đã bàn giao đơn vị vận chuyển', '2026-06-03 08:20:00'),
    (900935, 900901, 900001, 'SHIPPING', 'DELIVERED', 'Giao hàng thành công', '2026-06-05 15:50:00'),
    (900936, 900901, 900002, 'DELIVERED', 'COMPLETED', 'Khách hàng xác nhận đã nhận hàng', '2026-06-05 16:40:00'),
    (900937, 900902, 900003, NULL, 'PENDING', 'Khách hàng đặt đơn', '2026-06-11 20:10:00'),
    (900938, 900902, 900001, 'PENDING', 'CANCELLED', 'Đã duyệt yêu cầu hủy', '2026-06-12 10:30:00')
ON DUPLICATE KEY UPDATE note = VALUES(note), created_at = VALUES(created_at);

INSERT INTO coupon_usages
    (coupon_usage_id, coupon_id, user_id, order_id, discount_amount, status,
     used_at, reversed_at, created_at)
VALUES
    (900941, 900701, 900002, 900901, 500000, 'USED',
     '2026-06-02 09:15:00', NULL, '2026-06-02 09:15:00')
ON DUPLICATE KEY UPDATE
    discount_amount = VALUES(discount_amount), status = VALUES(status),
    used_at = VALUES(used_at), reversed_at = VALUES(reversed_at);

INSERT INTO inventory_transactions
    (inventory_transaction_id, product_variant_id, order_id, order_item_id, created_by,
     type, quantity_change, before_quantity, after_quantity, note, created_at)
VALUES
    (900951, 900501, 900901, 900911, 900001, 'SALE', -1, 39, 38,
     'Xuất kho cho đơn hàng #900901', '2026-06-02 09:30:00'),
    (900952, 900506, 900902, 900912, 900001, 'SALE', -1, 43, 42,
     'Giữ tồn kho cho đơn hàng #900902', '2026-06-11 20:15:00'),
    (900953, 900506, 900902, 900912, 900001, 'RESTOCK', 1, 42, 43,
     'Hoàn tồn do hủy đơn #900902', '2026-06-12 10:30:00')
ON DUPLICATE KEY UPDATE
    type = VALUES(type), quantity_change = VALUES(quantity_change),
    before_quantity = VALUES(before_quantity), after_quantity = VALUES(after_quantity),
    note = VALUES(note), created_at = VALUES(created_at);

INSERT INTO product_reviews
    (review_id, user_id, product_id, order_item_id, rating, title, content,
     anonymous, active, deleted, created_at, updated_at)
VALUES
    (900961, 900002, 900401, 900911, 5, 'Máy đẹp, giao nhanh',
     'Máy nguyên seal, màu đẹp và hoạt động ổn định. Nhân viên đóng gói cẩn thận, giao đúng hẹn.',
     0, 1, 0, '2026-06-07 19:20:00', '2026-06-07 19:20:00')
ON DUPLICATE KEY UPDATE
    rating = VALUES(rating), title = VALUES(title), content = VALUES(content),
    anonymous = VALUES(anonymous), active = VALUES(active), deleted = VALUES(deleted),
    updated_at = VALUES(updated_at);

INSERT INTO product_review_media
    (review_media_id, review_id, url, media_type, sort_order, created_at, updated_at)
VALUES
    (900971, 900961,
     'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
     'IMAGE', 0, '2026-06-07 19:20:00', '2026-06-07 19:20:00')
ON DUPLICATE KEY UPDATE url = VALUES(url), media_type = VALUES(media_type), sort_order = VALUES(sort_order);

INSERT INTO order_cancel_requests
    (cancel_request_id, order_id, requested_by, reason, status, reviewed_by,
     review_note, requested_at, reviewed_at)
VALUES
    (900981, 900902, 900003, 'Tôi chọn nhầm màu sản phẩm và muốn đặt lại.',
     'APPROVED', 900001, 'Đơn chưa bàn giao vận chuyển, chấp nhận hủy và hoàn tồn kho.',
     '2026-06-12 09:45:00', '2026-06-12 10:30:00')
ON DUPLICATE KEY UPDATE
    reason = VALUES(reason), status = VALUES(status), reviewed_by = VALUES(reviewed_by),
    review_note = VALUES(review_note), reviewed_at = VALUES(reviewed_at);

-- -----------------------------------------------------------------------------
-- Second realistic data set (doubles the business/demo data)
-- -----------------------------------------------------------------------------
INSERT INTO users
    (id, email, password, full_name, phone_number, avatar_url, status, is_deleted, created_at, update_at)
VALUES
    (901001, 'warehouse.seed@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Lê Hoàng Nam', '0901000011', 'https://i.pravatar.cc/300?img=11', 'ACTIVE', 0, NOW(), NOW()),
    (901002, 'mai.pham.seed@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Phạm Ngọc Mai', '0901000012', 'https://i.pravatar.cc/300?img=25', 'ACTIVE', 0, NOW(), NOW()),
    (901003, 'khoa.vo.seed@example.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Võ Đăng Khoa', '0901000013', 'https://i.pravatar.cc/300?img=15', 'ACTIVE', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name), avatar_url = VALUES(avatar_url), status = VALUES(status),
    is_deleted = VALUES(is_deleted), update_at = NOW();

INSERT IGNORE INTO users_roles (user_id, role_name) VALUES
    (901001, 'STAFF'), (901002, 'CUSTOMER'), (901003, 'CUSTOMER');

INSERT INTO addresses
    (address_id, user_id, recipient_name, phone_number, province_name, district_name,
     ward_name, full_address, address_type, is_default, is_deleted, created_at, updated_at)
VALUES
    (901101, 901002, 'Phạm Ngọc Mai', '0901000012', 'Thành phố Đà Nẵng',
     'Quận Hải Châu', 'Phường Hải Châu', '36 Bạch Đằng, Phường Hải Châu, Quận Hải Châu, Thành phố Đà Nẵng',
     'HOME', 1, 0, NOW(), NOW()),
    (901102, 901002, 'Phạm Ngọc Mai', '0901000012', 'Thành phố Đà Nẵng',
     'Quận Thanh Khê', 'Phường Thạc Gián', '210 Nguyễn Văn Linh, Phường Thạc Gián, Quận Thanh Khê, Thành phố Đà Nẵng',
     'OFFICE', 0, 0, NOW(), NOW()),
    (901103, 901003, 'Võ Đăng Khoa', '0901000013', 'Thành phố Cần Thơ',
     'Quận Ninh Kiều', 'Phường Tân An', '55 Hai Bà Trưng, Phường Tân An, Quận Ninh Kiều, Thành phố Cần Thơ',
     'HOME', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    recipient_name = VALUES(recipient_name), phone_number = VALUES(phone_number),
    full_address = VALUES(full_address), is_default = VALUES(is_default),
    is_deleted = VALUES(is_deleted), updated_at = NOW();

INSERT INTO category
    (id, name, slug, description, active, deleted, parent_id, created_at, updated_at)
VALUES
    (901201, 'Thiết bị gia dụng', 'thiet-bi-gia-dung',
     'Thiết bị tiện ích dành cho gia đình hiện đại', 1, 0, NULL, NOW(), NOW()),
    (901202, 'Robot hút bụi', 'robot-hut-bui',
     'Robot hút bụi và lau nhà thông minh', 1, 0, 901201, NOW(), NOW()),
    (901203, 'Màn hình máy tính', 'man-hinh-may-tinh',
     'Màn hình làm việc, đồ họa và giải trí', 1, 0, NULL, NOW(), NOW()),
    (901204, 'Màn hình văn phòng', 'man-hinh-van-phong',
     'Màn hình tối ưu cho công việc hàng ngày', 1, 0, 901203, NOW(), NOW()),
    (901205, 'Chuột và bàn phím', 'chuot-va-ban-phim',
     'Thiết bị nhập liệu không dây và có dây', 1, 0, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), description = VALUES(description), active = VALUES(active),
    deleted = VALUES(deleted), parent_id = VALUES(parent_id), updated_at = NOW();

INSERT INTO brands (id, name, slug, logo_url, active, deleted, created_at, update_at) VALUES
    (901301, 'Xiaomi', 'xiaomi', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg', 1, 0, NOW(), NOW()),
    (901302, 'Dell', 'dell', 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg', 1, 0, NOW(), NOW()),
    (901303, 'Logitech', 'logitech', 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg', 1, 0, NOW(), NOW()),
    (901304, 'LG', 'lg', 'https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), logo_url = VALUES(logo_url), active = VALUES(active),
    deleted = VALUES(deleted), update_at = NOW();

INSERT INTO products
    (id, name, slug, short_description, description, brand_id, category_id,
     active, deleted, created_at, update_at)
VALUES
    (901401, 'Xiaomi Robot Vacuum S10', 'xiaomi-robot-vacuum-s10',
     'Robot hút bụi lau nhà điều hướng laser LDS.',
     'Lực hút mạnh, lập bản đồ nhiều tầng, điều khiển qua ứng dụng và tự động quay về trạm sạc.',
     901301, 901202, 1, 0, NOW(), NOW()),
    (901402, 'Dell UltraSharp U2723QE', 'dell-ultrasharp-u2723qe',
     'Màn hình 4K USB-C 27 inch dành cho công việc chuyên nghiệp.',
     'Tấm nền IPS Black, độ phân giải 4K, hub USB-C và khả năng hiển thị màu chính xác.',
     901302, 901204, 1, 0, NOW(), NOW()),
    (901403, 'Logitech MX Master 3S', 'logitech-mx-master-3s',
     'Chuột không dây công thái học, yên tĩnh và chính xác.',
     'Cảm biến 8K DPI, cuộn MagSpeed, kết nối ba thiết bị và sạc nhanh qua USB-C.',
     901303, 901205, 1, 0, NOW(), NOW()),
    (901404, 'LG UltraGear 27GP850-B', 'lg-ultragear-27gp850-b',
     'Màn hình gaming QHD Nano IPS tần số quét cao.',
     'Màn hình 27 inch QHD, Nano IPS 1 ms, tần số quét 165 Hz và hỗ trợ Adaptive Sync.',
     901304, 901203, 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), short_description = VALUES(short_description),
    description = VALUES(description), brand_id = VALUES(brand_id), category_id = VALUES(category_id),
    active = VALUES(active), deleted = VALUES(deleted), update_at = NOW();

INSERT INTO product_variants
    (id, product_id, variant_name, stock_quantity, price, sale_price, currency, sku,
     active, deleted, created_at, update_at)
VALUES
    (901501, 901401, 'Màu trắng - Bản quốc tế', 22, 8990000, 7490000, 'VND', 'MI-S10-WHT-GLB', 1, 0, NOW(), NOW()),
    (901502, 901401, 'Màu đen - Bản quốc tế', 18, 8990000, 7690000, 'VND', 'MI-S10-BLK-GLB', 1, 0, NOW(), NOW()),
    (901503, 901402, '27 inch - 4K - USB-C', 13, 15990000, 14990000, 'VND', 'DE-U2723QE-27', 1, 0, NOW(), NOW()),
    (901504, 901403, 'Màu Graphite', 64, 2990000, 2490000, 'VND', 'LOG-MX3S-GRA', 1, 0, NOW(), NOW()),
    (901505, 901403, 'Màu Pale Gray', 37, 2990000, 2590000, 'VND', 'LOG-MX3S-GRY', 1, 0, NOW(), NOW()),
    (901506, 901404, '27 inch - QHD - 165Hz', 18, 11990000, 9990000, 'VND', 'LG-27GP850-QHD', 1, 0, NOW(), NOW()),
    (901507, 901404, '27 inch - QHD - 180Hz OC', 11, 12490000, 10490000, 'VND', 'LG-27GP850-OC', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    variant_name = VALUES(variant_name), stock_quantity = VALUES(stock_quantity),
    price = VALUES(price), sale_price = VALUES(sale_price), currency = VALUES(currency),
    active = VALUES(active), deleted = VALUES(deleted), update_at = NOW();

INSERT INTO product_media
    (id, product_id, url, media_type, is_thumbnail, sort_order, alt_text,
     active, deleted, created_at, updated_at)
VALUES
    (901601, 901401, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'Xiaomi Robot Vacuum S10', 1, 0, NOW(), NOW()),
    (901602, 901402, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'Màn hình Dell UltraSharp', 1, 0, NOW(), NOW()),
    (901603, 901403, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'Chuột Logitech MX Master 3S', 1, 0, NOW(), NOW()),
    (901604, 901404, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80', 'IMAGE', 1, 0, 'Màn hình LG UltraGear', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    url = VALUES(url), media_type = VALUES(media_type), is_thumbnail = VALUES(is_thumbnail),
    sort_order = VALUES(sort_order), alt_text = VALUES(alt_text), active = VALUES(active),
    deleted = VALUES(deleted), updated_at = NOW();

INSERT INTO coupon
    (coupon_id, code, name, description, discount_type, discount_value,
     min_order_amount, max_discount_amount, usage_limit, used_count, per_user_limit,
     start_at, end_at, active, deleted, created_at, updated_at)
VALUES
    (901701, 'TECHDEAL2026', 'Ưu đãi công nghệ', 'Giảm 8% tối đa 400.000đ cho đơn từ 2.000.000đ.',
     'PERCENT', 8, 2000000, 400000, 800, 1, 1,
     '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1, 0, NOW(), NOW()),
    (901702, 'FREESHIP50', 'Hỗ trợ phí vận chuyển', 'Giảm trực tiếp 50.000đ cho đơn từ 500.000đ.',
     'FIXED_AMOUNT', 50000, 500000, NULL, 2000, 0, 3,
     '2026-01-01 00:00:00', '2027-12-31 23:59:59', 1, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), description = VALUES(description), discount_type = VALUES(discount_type),
    discount_value = VALUES(discount_value), min_order_amount = VALUES(min_order_amount),
    max_discount_amount = VALUES(max_discount_amount), usage_limit = VALUES(usage_limit),
    per_user_limit = VALUES(per_user_limit), start_at = VALUES(start_at), end_at = VALUES(end_at),
    active = VALUES(active), deleted = VALUES(deleted), updated_at = NOW();

INSERT INTO carts (cart_id, user_id, status, created_at, updated_at) VALUES
    (901801, 901002, 'ACTIVE', NOW(), NOW()),
    (901802, 901003, 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = NOW();

INSERT INTO cart_items
    (cart_item_id, cart_id, product_variant_id, quantity, unit_price, created_at, updated_at)
VALUES
    (901811, 901801, 901502, 1, 7690000, NOW(), NOW()),
    (901812, 901801, 901504, 1, 2490000, NOW(), NOW()),
    (901813, 901802, 901507, 1, 10490000, NOW(), NOW())
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), unit_price = VALUES(unit_price), updated_at = NOW();

INSERT INTO orders
    (order_id, user_id, address_id, coupon_id, recipient_name, phone_number, shipping_address,
     status, payment_status, shipping_status, subtotal_amount, shipping_fee, discount_amount,
     total_amount, note, cancelled_at, created_at, updated_at)
VALUES
    (901901, 901002, 901101, 901701, 'Phạm Ngọc Mai', '0901000012',
     '36 Bạch Đằng, Phường Hải Châu, Quận Hải Châu, Thành phố Đà Nẵng',
     'COMPLETED', 'PAID', 'DELIVERED', 14990000, 0, 400000, 14590000,
     'Giao tại quầy lễ tân, gọi trước 15 phút.', NULL,
     '2026-06-08 08:30:00', '2026-06-11 18:20:00'),
    (901902, 901003, 901103, NULL, 'Võ Đăng Khoa', '0901000013',
     '55 Hai Bà Trưng, Phường Tân An, Quận Ninh Kiều, Thành phố Cần Thơ',
     'CANCELLED', 'CANCELLED', 'CANCELLED', 9990000, 0, 0, 9990000,
     'Ưu tiên giao vào cuối tuần.', '2026-06-16 11:05:00',
     '2026-06-15 21:00:00', '2026-06-16 11:05:00')
ON DUPLICATE KEY UPDATE
    status = VALUES(status), payment_status = VALUES(payment_status),
    shipping_status = VALUES(shipping_status), total_amount = VALUES(total_amount),
    note = VALUES(note), cancelled_at = VALUES(cancelled_at), updated_at = VALUES(updated_at);

INSERT INTO order_items
    (order_item_id, order_id, product_variant_id, product_name, variant_name, sku,
     quantity, unit_price, line_total, created_at, updated_at)
VALUES
    (901911, 901901, 901503, 'Dell UltraSharp U2723QE', '27 inch - 4K - USB-C', 'DE-U2723QE-27',
     1, 14990000, 14990000, '2026-06-08 08:30:00', '2026-06-08 08:30:00'),
    (901912, 901902, 901506, 'LG UltraGear 27GP850-B', '27 inch - QHD - 165Hz', 'LG-27GP850-QHD',
     1, 9990000, 9990000, '2026-06-15 21:00:00', '2026-06-16 11:05:00')
ON DUPLICATE KEY UPDATE
    product_name = VALUES(product_name), variant_name = VALUES(variant_name),
    quantity = VALUES(quantity), unit_price = VALUES(unit_price), line_total = VALUES(line_total),
    updated_at = VALUES(updated_at);

INSERT INTO payments
    (payment_id, order_id, method, status, amount, transaction_code, gateway_response,
     paid_at, created_at, updated_at)
VALUES
    (901921, 901901, 'MOMO', 'PAID', 14590000, 'MOMO-SEED-901901',
     '{"resultCode":0,"message":"Giao dịch thành công"}',
     '2026-06-08 08:33:00', '2026-06-08 08:31:00', '2026-06-08 08:33:00'),
    (901922, 901902, 'COD', 'CANCELLED', 9990000, NULL, NULL,
     NULL, '2026-06-15 21:00:00', '2026-06-16 11:05:00')
ON DUPLICATE KEY UPDATE
    method = VALUES(method), status = VALUES(status), amount = VALUES(amount),
    transaction_code = VALUES(transaction_code), gateway_response = VALUES(gateway_response),
    paid_at = VALUES(paid_at), updated_at = VALUES(updated_at);

INSERT INTO order_status_history
    (order_status_history_id, order_id, changed_by, old_status, new_status, note, created_at)
VALUES
    (901931, 901901, 901002, NULL, 'PENDING', 'Khách hàng đặt đơn', '2026-06-08 08:30:00'),
    (901932, 901901, 901001, 'PENDING', 'CONFIRMED', 'Đã xác nhận thanh toán MoMo', '2026-06-08 08:40:00'),
    (901933, 901901, 901001, 'CONFIRMED', 'PROCESSING', 'Đang chuẩn bị hàng tại kho', '2026-06-08 13:15:00'),
    (901934, 901901, 901001, 'PROCESSING', 'SHIPPING', 'Đơn hàng đã rời kho', '2026-06-09 07:45:00'),
    (901935, 901901, 901001, 'SHIPPING', 'DELIVERED', 'Giao hàng thành công', '2026-06-11 17:55:00'),
    (901936, 901901, 901002, 'DELIVERED', 'COMPLETED', 'Khách hàng xác nhận hoàn tất', '2026-06-11 18:20:00'),
    (901937, 901902, 901003, NULL, 'PENDING', 'Khách hàng đặt đơn', '2026-06-15 21:00:00'),
    (901938, 901902, 901001, 'PENDING', 'CANCELLED', 'Đã duyệt yêu cầu đổi sản phẩm', '2026-06-16 11:05:00')
ON DUPLICATE KEY UPDATE note = VALUES(note), created_at = VALUES(created_at);

INSERT INTO coupon_usages
    (coupon_usage_id, coupon_id, user_id, order_id, discount_amount, status,
     used_at, reversed_at, created_at)
VALUES
    (901941, 901701, 901002, 901901, 400000, 'USED',
     '2026-06-08 08:30:00', NULL, '2026-06-08 08:30:00')
ON DUPLICATE KEY UPDATE
    discount_amount = VALUES(discount_amount), status = VALUES(status),
    used_at = VALUES(used_at), reversed_at = VALUES(reversed_at);

INSERT INTO inventory_transactions
    (inventory_transaction_id, product_variant_id, order_id, order_item_id, created_by,
     type, quantity_change, before_quantity, after_quantity, note, created_at)
VALUES
    (901951, 901503, 901901, 901911, 901001, 'SALE', -1, 14, 13,
     'Xuất kho cho đơn hàng #901901', '2026-06-08 08:40:00'),
    (901952, 901506, 901902, 901912, 901001, 'SALE', -1, 18, 17,
     'Giữ tồn kho cho đơn hàng #901902', '2026-06-15 21:05:00'),
    (901953, 901506, 901902, 901912, 901001, 'RESTOCK', 1, 17, 18,
     'Hoàn tồn do hủy đơn #901902', '2026-06-16 11:05:00')
ON DUPLICATE KEY UPDATE
    type = VALUES(type), quantity_change = VALUES(quantity_change),
    before_quantity = VALUES(before_quantity), after_quantity = VALUES(after_quantity),
    note = VALUES(note), created_at = VALUES(created_at);

INSERT INTO product_reviews
    (review_id, user_id, product_id, order_item_id, rating, title, content,
     anonymous, active, deleted, created_at, updated_at)
VALUES
    (901961, 901002, 901402, 901911, 5, 'Màn hình sắc nét, màu đẹp',
     'Độ phân giải 4K rất nét, cổng USB-C tiện cho laptop. Chân đế chắc chắn và đóng gói kỹ.',
     0, 1, 0, '2026-06-13 20:10:00', '2026-06-13 20:10:00')
ON DUPLICATE KEY UPDATE
    rating = VALUES(rating), title = VALUES(title), content = VALUES(content),
    anonymous = VALUES(anonymous), active = VALUES(active), deleted = VALUES(deleted),
    updated_at = VALUES(updated_at);

INSERT INTO product_review_media
    (review_media_id, review_id, url, media_type, sort_order, created_at, updated_at)
VALUES
    (901971, 901961,
     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
     'IMAGE', 0, '2026-06-13 20:10:00', '2026-06-13 20:10:00')
ON DUPLICATE KEY UPDATE url = VALUES(url), media_type = VALUES(media_type), sort_order = VALUES(sort_order);

INSERT INTO order_cancel_requests
    (cancel_request_id, order_id, requested_by, reason, status, reviewed_by,
     review_note, requested_at, reviewed_at)
VALUES
    (901981, 901902, 901003, 'Tôi muốn đổi sang phiên bản màn hình có tần số quét cao hơn.',
     'APPROVED', 901001, 'Đơn chưa giao cho đơn vị vận chuyển, đã hoàn lại tồn kho.',
     '2026-06-16 10:20:00', '2026-06-16 11:05:00')
ON DUPLICATE KEY UPDATE
    reason = VALUES(reason), status = VALUES(status), reviewed_by = VALUES(reviewed_by),
    review_note = VALUES(review_note), reviewed_at = VALUES(reviewed_at);

COMMIT;

-- Quick verification summary.
SELECT 'users' AS entity, COUNT(*) AS seeded_rows FROM users WHERE id BETWEEN 900000 AND 901999
UNION ALL SELECT 'addresses', COUNT(*) FROM addresses WHERE address_id BETWEEN 900000 AND 901999
UNION ALL SELECT 'categories', COUNT(*) FROM category WHERE id BETWEEN 900000 AND 901999
UNION ALL SELECT 'brands', COUNT(*) FROM brands WHERE id BETWEEN 900000 AND 901999
UNION ALL SELECT 'products', COUNT(*) FROM products WHERE id BETWEEN 900000 AND 901999
UNION ALL SELECT 'variants', COUNT(*) FROM product_variants WHERE id BETWEEN 900000 AND 901999
UNION ALL SELECT 'coupons', COUNT(*) FROM coupon WHERE coupon_id BETWEEN 900000 AND 901999
UNION ALL SELECT 'orders', COUNT(*) FROM orders WHERE order_id BETWEEN 900000 AND 901999
UNION ALL SELECT 'reviews', COUNT(*) FROM product_reviews WHERE review_id BETWEEN 900000 AND 901999;
