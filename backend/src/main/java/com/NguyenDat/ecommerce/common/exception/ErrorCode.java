package com.NguyenDat.ecommerce.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // 9999 - System
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(9998, "Invalid request data", HttpStatus.BAD_REQUEST),

    // 1000 - User
    USER_NOT_EXISTED(1000, "User not found", HttpStatus.NOT_FOUND),
    USER_EXISTED(1001, "User already existed", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1002, "Email already existed", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1003, "Phone number already existed", HttpStatus.BAD_REQUEST),
    USER_INACTIVE(1004, "User account is inactive", HttpStatus.FORBIDDEN),
    USER_DELETED(1006, "User has been deleted", HttpStatus.NOT_FOUND),

    // 1100 - Validation
    INVALID_EMAIL(1100, "Email is invalid", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_FORMAT(
            1101,
            "Password must contain at least {min} characters, including uppercase, number, and special character.",
            HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1102, "Phone number must be exactly 10 digits.", HttpStatus.BAD_REQUEST),
    INVALID_FULL_NAME(1103, "Full name must be at least {min} characters", HttpStatus.BAD_REQUEST),
    FIELD_REQUIRED(1104, "This field is required", HttpStatus.BAD_REQUEST),
    STOCK_MUST_BE_POSITIVE(1105, "Stock quantity must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    PRICE_MUST_BE_POSITIVE(1106, "Price must be greater than 0", HttpStatus.BAD_REQUEST),
    SALE_PRICE_MUST_BE_NON_NEGATIVE(1107, "Sale price must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_SALE_PRICE(
            1108, "Price must be greater than or equal to sale price", HttpStatus.BAD_REQUEST),
    INVALID_USER_STATUS(1109, "Status must be one of: ACTIVE, INACTIVE", HttpStatus.BAD_REQUEST),

    // 2000 - Role & Permission
    ROLE_NOT_FOUND(2000, "Role not found", HttpStatus.NOT_FOUND),
    ROLE_EXISTED(2001, "Role already existed", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(2002, "Permission not found", HttpStatus.NOT_FOUND),
    PERMISSION_EXISTED(2003, "Permission already existed", HttpStatus.BAD_REQUEST),
    PERMISSION_IN_USE(2004, "Permission is assigned to one or more roles", HttpStatus.BAD_REQUEST),

    // 3000 - Auth & JWT
    UNAUTHENTICATED(3000, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(3001, "You do not have permission", HttpStatus.FORBIDDEN),
    TOKEN_INVALID(3002, "Token is invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(3003, "Token has expired", HttpStatus.UNAUTHORIZED),
    TOKEN_BLACKLISTED(3004, "Token has been logged out", HttpStatus.UNAUTHORIZED),

    // product
    PRODUCT_EXISTED(3500, "Product already existed", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(3501, "Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_DELETED(3502, "Product has been deleted", HttpStatus.NOT_FOUND),
    PRODUCT_INACTIVE(3503, "Product is inactive", HttpStatus.FORBIDDEN),

    // product variant
    PRODUCT_VARIANT_NOT_FOUND(3600, "Product variant not found", HttpStatus.NOT_FOUND),
    PRODUCT_VARIANT_DELETED(3601, "Product variant has been deleted", HttpStatus.NOT_FOUND),
    PRODUCT_VARIANT_INACTIVE(3602, "Product variant is inactive", HttpStatus.FORBIDDEN),
    PRODUCT_VARIANT_SKU_EXISTED(3603, "Product variant SKU already existed", HttpStatus.BAD_REQUEST),

    // product media
    PRODUCT_MEDIA_NOT_FOUND(3700, "Product media not found", HttpStatus.NOT_FOUND),
    PRODUCT_MEDIA_DELETED(3701, "Product media has been deleted", HttpStatus.NOT_FOUND),
    PRODUCT_MEDIA_INACTIVE(3702, "Product media is inactive", HttpStatus.FORBIDDEN),
    PRODUCT_MEDIA_THUMBNAIL_REQUIRED(3703, "Product must have a thumbnail media", HttpStatus.BAD_REQUEST),
    PRODUCT_MEDIA_EXISTED(3704, "Product media already existed", HttpStatus.BAD_REQUEST),

    // brand
    BRAND_EXISTED(4000, "Brand already existed", HttpStatus.BAD_REQUEST),
    BRAND_NOT_FOUND(4001, "Brand not found", HttpStatus.NOT_FOUND),
    BRAND_DELETED(4002, "Brand has been deleted", HttpStatus.NOT_FOUND),
    BRAND_INACTIVE(4003, "Brand is inactive", HttpStatus.NOT_FOUND),
    BRAND_HAS_PRODUCTS(4004, "Brand has associated products and can only be set inactive", HttpStatus.BAD_REQUEST),

    // category
    CATEGORY_EXISTED(5000, "Category already existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(5001, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_DELETED(5002, "Category has been deleted", HttpStatus.NOT_FOUND),
    PARENT_CATEGORY_NOT_FOUND(5003, "Parent category not found", HttpStatus.NOT_FOUND),
    CATEGORY_HAS_CHILDREN(5005, "Category has child categories", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_PRODUCTS(5006, "Category has associated products", HttpStatus.BAD_REQUEST),
    CATEGORY_CIRCULAR_REFERENCE(5007, "Category parent creates a circular reference", HttpStatus.BAD_REQUEST),
    CATEGORY_INACTIVE(5004, "Category is inactive", HttpStatus.FORBIDDEN),

    // coupon
    COUPON_EXISTED(8000, "Coupon code already existed", HttpStatus.BAD_REQUEST),
    COUPON_NOT_FOUND(8001, "Coupon not found", HttpStatus.NOT_FOUND),
    COUPON_DELETED(8002, "Coupon has been deleted", HttpStatus.NOT_FOUND),
    COUPON_INACTIVE(8003, "Coupon is inactive", HttpStatus.FORBIDDEN),
    COUPON_EXPIRED(8004, "Coupon has expired", HttpStatus.BAD_REQUEST),
    COUPON_NOT_STARTED(8005, "Coupon is not active yet", HttpStatus.BAD_REQUEST),
    COUPON_USAGE_LIMIT_REACHED(8006, "Coupon usage limit has been reached", HttpStatus.BAD_REQUEST),
    COUPON_PER_USER_LIMIT_REACHED(8007, "Coupon usage limit per user has been reached", HttpStatus.BAD_REQUEST),
    COUPON_MIN_ORDER_AMOUNT_NOT_REACHED(
            8008, "Order amount does not meet coupon minimum amount", HttpStatus.BAD_REQUEST),
    COUPON_DATE_INVALID(8009, "Coupon end date must be after start date", HttpStatus.BAD_REQUEST),
    COUPON_PERCENT_INVALID(8010, "Percent discount must be less than or equal to 100", HttpStatus.BAD_REQUEST),
    COUPON_CODE_REQUIRED(8011, "Coupon code is required", HttpStatus.BAD_REQUEST),
    COUPON_NAME_REQUIRED(8012, "Coupon name is required", HttpStatus.BAD_REQUEST),
    COUPON_CODE_INVALID(8013, "Coupon code must not exceed 64 characters", HttpStatus.BAD_REQUEST),
    COUPON_NAME_INVALID(8014, "Coupon name must not exceed 150 characters", HttpStatus.BAD_REQUEST),
    COUPON_DESCRIPTION_INVALID(8015, "Coupon description must not exceed 500 characters", HttpStatus.BAD_REQUEST),
    DISCOUNT_TYPE_REQUIRED(8016, "Discount type is required", HttpStatus.BAD_REQUEST),
    DISCOUNT_VALUE_REQUIRED(8017, "Discount value is required", HttpStatus.BAD_REQUEST),
    DISCOUNT_VALUE_INVALID(8018, "Discount value must be greater than 0", HttpStatus.BAD_REQUEST),
    MIN_ORDER_AMOUNT_INVALID(8019, "Minimum order amount must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    MAX_DISCOUNT_AMOUNT_INVALID(
            8020, "Maximum discount amount must be greater than or equal to 0", HttpStatus.BAD_REQUEST),
    USAGE_LIMIT_INVALID(8021, "Usage limit must be greater than 0", HttpStatus.BAD_REQUEST),
    PER_USER_LIMIT_INVALID(8022, "Per-user limit must be greater than 0", HttpStatus.BAD_REQUEST),

    // address
    ADDRESS_NOT_FOUND(9000, "Address not found", HttpStatus.NOT_FOUND),
    ADDRESS_NOT_BELONG_TO_USER(9001, "Address does not belong to current user", HttpStatus.FORBIDDEN),
    ADDRESS_DELETED(9002, "Address has been deleted", HttpStatus.NOT_FOUND),
    ADDRESS_TYPE_REQUIRED(9003, "Address type is required", HttpStatus.BAD_REQUEST),
    RECIPIENT_NAME_REQUIRED(9004, "Recipient name is required", HttpStatus.BAD_REQUEST),
    RECIPIENT_NAME_INVALID(9005, "Recipient name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    ADDRESS_PHONE_REQUIRED(9006, "Phone number is required", HttpStatus.BAD_REQUEST),
    ADDRESS_PHONE_INVALID(9007, "Phone number must not exceed 20 characters", HttpStatus.BAD_REQUEST),
    PROVINCE_NAME_REQUIRED(9008, "Province name is required", HttpStatus.BAD_REQUEST),
    PROVINCE_NAME_INVALID(9009, "Province name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    DISTRICT_NAME_REQUIRED(9010, "District name is required", HttpStatus.BAD_REQUEST),
    DISTRICT_NAME_INVALID(9011, "District name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    WARD_NAME_REQUIRED(9012, "Ward name is required", HttpStatus.BAD_REQUEST),
    WARD_NAME_INVALID(9013, "Ward name must not exceed 100 characters", HttpStatus.BAD_REQUEST),
    FULL_ADDRESS_REQUIRED(9014, "Full address is required", HttpStatus.BAD_REQUEST),
    FULL_ADDRESS_INVALID(9015, "Full address must not exceed 200 characters", HttpStatus.BAD_REQUEST),
    DEFAULT_ADDRESS_CANNOT_BE_DELETED(
            9016,
            "Default address cannot be deleted. Please set another address as default first.",
            HttpStatus.BAD_REQUEST),

    // cart
    CART_NOT_FOUND(10000, "Cart not found", HttpStatus.NOT_FOUND),
    CART_EMPTY(10001, "Cart is empty", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(10002, "Cart item not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_BELONG_TO_USER(10003, "Cart item does not belong to current user", HttpStatus.FORBIDDEN),
    CART_ITEM_QUANTITY_REQUIRED(10004, "Cart item quantity is required", HttpStatus.BAD_REQUEST),
    CART_ITEM_QUANTITY_INVALID(10005, "Cart item quantity must be greater than 0", HttpStatus.BAD_REQUEST),
    CART_ITEM_QUANTITY_EXCEEDS_STOCK(10006, "Cart item quantity exceeds available stock", HttpStatus.BAD_REQUEST),
    PRODUCT_VARIANT_OUT_OF_STOCK(10007, "Product variant is out of stock", HttpStatus.BAD_REQUEST),
    CART_PRODUCT_VARIANT_REQUIRED(10008, "Product variant is required", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
