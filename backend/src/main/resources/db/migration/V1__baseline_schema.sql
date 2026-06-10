SET FOREIGN_KEY_CHECKS = 0;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` bigint NOT NULL AUTO_INCREMENT,
  `address_type` enum('HOME','OFFICE','OTHER') NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_deleted` bit(1) NOT NULL,
  `district_name` varchar(100) NOT NULL,
  `full_address` varchar(200) NOT NULL,
  `is_default` bit(1) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `province_name` varchar(100) NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward_name` varchar(100) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKoce3937d2f4mpfqrycbr0l93m` (`name`),
  UNIQUE KEY `UKpnhnc9urm6fro7oseu9vka70q` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `cart_item_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `cart_id` bigint NOT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `uk_cart_item_cart_variant` (`cart_id`,`product_variant_id`),
  KEY `FKn1s4l7h0vm4o259wpu7ft0y2y` (`product_variant_id`),
  CONSTRAINT `FKn1s4l7h0vm4o259wpu7ft0y2y` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('ABANDONED','ACTIVE','CHECKED_OUT') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `description` text,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhqknmjh5423vchi4xkyhxlhg2` (`slug`),
  KEY `FK2y94svpmqttx80mshyny85wqr` (`parent_id`),
  CONSTRAINT `FK2y94svpmqttx80mshyny85wqr` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `coupon_id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `code` varchar(64) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `discount_type` enum('FIXED_AMOUNT','PERCENT') NOT NULL,
  `discount_value` decimal(12,2) NOT NULL,
  `end_at` datetime(6) DEFAULT NULL,
  `max_discount_amount` decimal(12,2) DEFAULT NULL,
  `min_order_amount` decimal(12,2) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `per_user_limit` int DEFAULT NULL,
  `start_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int NOT NULL,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `UKbg4p9ontpj7adq7yr71h93sdn` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_usages` (
  `coupon_usage_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_amount` decimal(12,2) NOT NULL,
  `reversed_at` datetime(6) DEFAULT NULL,
  `status` enum('REVERSED','USED') NOT NULL,
  `used_at` datetime(6) NOT NULL,
  `coupon_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`coupon_usage_id`),
  UNIQUE KEY `uk_coupon_usage_order` (`order_id`),
  KEY `idx_coupon_usage_coupon_user` (`coupon_id`,`user_id`,`status`),
  KEY `FK6mev6grxbqmt8l0jxvobfg70n` (`user_id`),
  CONSTRAINT `FK6mev6grxbqmt8l0jxvobfg70n` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKf6qd92pos37kgj47pg2gfpy5g` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`coupon_id`),
  CONSTRAINT `FKs9yuckyrsqcsgmjsus1unapt4` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidated_tokens` (
  `token_id` varchar(255) NOT NULL,
  `expiry_time` datetime(6) NOT NULL,
  PRIMARY KEY (`token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transactions` (
  `inventory_transaction_id` bigint NOT NULL AUTO_INCREMENT,
  `after_quantity` int NOT NULL,
  `before_quantity` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL,
  `quantity_change` int NOT NULL,
  `type` enum('RESTOCK','SALE') NOT NULL,
  `created_by` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `order_item_id` bigint DEFAULT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`inventory_transaction_id`),
  KEY `FKjcpd725xjfv6sovo5t7y33b3f` (`created_by`),
  KEY `FK34icjdnh4bp4eni6hhjdhbbjl` (`order_id`),
  KEY `FKgnp8du50yq9jckdkxrf5d2gwt` (`order_item_id`),
  KEY `FKr8ovd4msjdy3vhm6m7dlonmbo` (`product_variant_id`),
  CONSTRAINT `FK34icjdnh4bp4eni6hhjdhbbjl` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKgnp8du50yq9jckdkxrf5d2gwt` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`),
  CONSTRAINT `FKjcpd725xjfv6sovo5t7y33b3f` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKr8ovd4msjdy3vhm6m7dlonmbo` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_cancel_requests` (
  `cancel_request_id` bigint NOT NULL AUTO_INCREMENT,
  `reason` varchar(500) NOT NULL,
  `requested_at` datetime(6) DEFAULT NULL,
  `review_note` varchar(500) DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `order_id` bigint NOT NULL,
  `requested_by` bigint NOT NULL,
  `reviewed_by` bigint DEFAULT NULL,
  PRIMARY KEY (`cancel_request_id`),
  UNIQUE KEY `UKd4kwlonqys77lye6o2j1yiwo5` (`order_id`),
  KEY `FKg45nya1n7ay1p4hx32jt2l8nt` (`requested_by`),
  KEY `FKm7mksilupl9ml40ylxm8ns5dt` (`reviewed_by`),
  CONSTRAINT `FKdmn74wh86ag7b3wuacsu1v730` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKg45nya1n7ay1p4hx32jt2l8nt` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKm7mksilupl9ml40ylxm8ns5dt` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `quantity` int NOT NULL,
  `sku` varchar(64) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `variant_name` varchar(150) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_variant_id` bigint NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKltmtlue0wixrg1cf0xo7x0l4d` (`product_variant_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FKltmtlue0wixrg1cf0xo7x0l4d` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `order_status_history_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `new_status` enum('CANCELLED','COMPLETED','CONFIRMED','DELIVERED','PENDING','PROCESSING','RETURNED','SHIPPING') NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `old_status` enum('CANCELLED','COMPLETED','CONFIRMED','DELIVERED','PENDING','PROCESSING','RETURNED','SHIPPING') DEFAULT NULL,
  `changed_by` bigint DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`order_status_history_id`),
  KEY `FKj7bba43h8j0n4evd2wvudvpjc` (`changed_by`),
  KEY `FKnmcbg3mmbt8wfva97ra40nmp3` (`order_id`),
  CONSTRAINT `FKj7bba43h8j0n4evd2wvudvpjc` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKnmcbg3mmbt8wfva97ra40nmp3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `discount_amount` decimal(12,2) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `payment_status` enum('CANCELLED','FAILED','PAID','REFUNDED','UNPAID') NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `shipping_address` varchar(300) NOT NULL,
  `shipping_fee` decimal(12,2) NOT NULL,
  `shipping_status` enum('CANCELLED','DELIVERED','NOT_SHIPPED','PENDING','PREPARING','RETURNED','SHIPPING') NOT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','DELIVERED','PENDING','PROCESSING','RETURNED','SHIPPING') NOT NULL,
  `subtotal_amount` decimal(12,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address_id` bigint DEFAULT NULL,
  `coupon_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FKhlglkvf5i60dv6dn397ethgpt` (`address_id`),
  KEY `FKa5ei0aklq6wrjl8vrr7ied3bx` (`coupon_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKa5ei0aklq6wrjl8vrr7ied3bx` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`coupon_id`),
  CONSTRAINT `FKhlglkvf5i60dv6dn397ethgpt` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `gateway_response` text,
  `method` enum('BANK_TRANSFER','COD','MOMO','VNPAY') NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `status` enum('CANCELLED','FAILED','PAID','REFUNDED','UNPAID') NOT NULL,
  `transaction_code` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `UK8vo36cen604as7etdfwmyjsxt` (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `is_thumbnail` bit(1) DEFAULT NULL,
  `media_type` varchar(50) NOT NULL,
  `sort_order` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6d0dleyyjhq9qg62vto0kn01f` (`product_id`),
  CONSTRAINT `FK6d0dleyyjhq9qg62vto0kn01f` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review_media` (
  `review_media_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `media_type` enum('IMAGE','VIDEO') NOT NULL,
  `sort_order` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `review_id` bigint NOT NULL,
  PRIMARY KEY (`review_media_id`),
  KEY `FKbrlnmogqtxbek3763sqm37t2n` (`review_id`),
  CONSTRAINT `FKbrlnmogqtxbek3763sqm37t2n` FOREIGN KEY (`review_id`) REFERENCES `product_reviews` (`review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `anonymous` bit(1) NOT NULL,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `order_item_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `uk_product_review_order_item` (`order_item_id`),
  KEY `FK35kxxqe2g9r4mww80w9e3tnw9` (`product_id`),
  KEY `FK58i39bhws2hss3tbcvdmrm60f` (`user_id`),
  CONSTRAINT `FK35kxxqe2g9r4mww80w9e3tnw9` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FK58i39bhws2hss3tbcvdmrm60f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKau5g3dylb9eh7ua5xjjw6uopw` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`order_item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `currency` varchar(3) NOT NULL,
  `deleted` bit(1) NOT NULL,
  `price` double NOT NULL,
  `sale_price` double NOT NULL,
  `sku` varchar(64) NOT NULL,
  `stock_quantity` int NOT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `variant_name` varchar(150) NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq935p2d1pbjm39n0063ghnfgn` (`sku`),
  KEY `FKosqitn4s405cynmhb87lkvuau` (`product_id`),
  CONSTRAINT `FKosqitn4s405cynmhb87lkvuau` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `description` longtext,
  `name` varchar(200) NOT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `brand_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKostq1ec3toafnjok09y9l7dox` (`slug`),
  KEY `FKa3a4mpsfdf4d2y6r8ra3sc8mv` (`brand_id`),
  KEY `FK1cf90etcu98x1e6n9aks3tel3` (`category_id`),
  CONSTRAINT `FK1cf90etcu98x1e6n9aks3tel3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `FKa3a4mpsfdf4d2y6r8ra3sc8mv` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_permissions` (
  `role_name` varchar(255) NOT NULL,
  `permissions_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_name`,`permissions_name`),
  KEY `FKpqh0ean4n5un6h790yuaimjj8` (`permissions_name`),
  CONSTRAINT `FK6nw4jrj1tuu04j9rk7xwfssd6` FOREIGN KEY (`role_name`) REFERENCES `roles` (`name`),
  CONSTRAINT `FKpqh0ean4n5un6h790yuaimjj8` FOREIGN KEY (`permissions_name`) REFERENCES `permission` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `password` varchar(250) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK9q63snka3mdh91as4io72espi` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `user_id` bigint NOT NULL,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`role_name`),
  KEY `FKfddtbwrqg5sal9y57yyol7579` (`role_name`),
  CONSTRAINT `FK2o0jvgh89lemvvo17cbqvdxaa` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKfddtbwrqg5sal9y57yyol7579` FOREIGN KEY (`role_name`) REFERENCES `roles` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET FOREIGN_KEY_CHECKS = 1;
