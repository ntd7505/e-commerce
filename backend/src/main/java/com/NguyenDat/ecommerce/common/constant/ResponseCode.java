package com.NguyenDat.ecommerce.common.constant;

import lombok.Getter;

@Getter
public enum ResponseCode {
    // 1000 - Common
    SUCCESS(1000, "Success"),
    NO_DATA_FOUND(1005, "No data found"),

    // 1100 - User
    USER_CREATED(1100, "User created successfully"),
    USER_FETCHED(1101, "User fetched successfully"),
    USER_UPDATED(1102, "User updated successfully"),
    USER_DELETED(1103, "User deleted successfully"),
    USERS_FETCHED(1104, "Users fetched successfully"),
    DELETED_USERS_FETCHED(1105, "Deleted users fetched successfully"),
    USER_STATUS_UPDATED(1106, "User status updated successfully"),

    // 2000 - Auth
    LOGIN_SUCCESS(2000, "Login successfully"),
    LOGOUT_SUCCESS(2001, "Logout successfully"),
    REFRESH_TOKEN_SUCCESS(2002, "Refresh token successfully"),
    INTROSPECT_SUCCESS(2003, "Introspect successfully"),

    // 3000 - Product
    PRODUCT_CREATED(3000, "Product created successfully"),
    PRODUCT_FETCHED(3001, "Product fetched successfully"),
    PRODUCT_UPDATED(3002, "Product updated successfully"),
    PRODUCT_STATUS_UPDATED(3003, "Product status updated successfully"),
    PRODUCT_DELETED(3004, "Product deleted successfully"),
    PRODUCTS_FETCHED(3005, "Products fetched successfully"),
    PRODUCT_VARIANT_CREATED(3006, "Product variant created successfully"),
    PRODUCT_VARIANT_FETCHED(3007, "Product variant fetched successfully"),
    PRODUCT_VARIANT_UPDATED(3008, "Product variant updated successfully"),
    PRODUCT_VARIANT_DELETED(3009, "Product variant deleted successfully"),
    PRODUCT_VARIANT_STATUS_UPDATED(3010, "Product variant status updated successfully"),
    PRODUCT_MEDIA_CREATED(3011, "Product media created successfully"),
    PRODUCT_MEDIA_FETCHED(3012, "Product media fetched successfully"),
    PRODUCT_MEDIA_UPDATED(3013, "Product media updated successfully"),
    PRODUCT_MEDIA_DELETED(3014, "Product media deleted successfully"),
    PRODUCT_MEDIA_REORDERED(3015, "Product media reordered successfully"),

    // 4000 - Role
    ROLE_CREATED(4000, "Role created successfully"),
    ROLE_FETCHED(4001, "Role fetched successfully"),
    ROLE_UPDATED(4002, "Role updated successfully"),
    ROLE_DELETED(4003, "Role deleted successfully"),
    ROLES_FETCHED(4004, "Roles fetched successfully"),

    // 5000 - Permission
    PERMISSION_CREATED(5000, "Permission created successfully"),
    PERMISSION_FETCHED(5001, "Permission fetched successfully"),
    PERMISSION_DELETED(5002, "Permission deleted successfully"),
    PERMISSIONS_FETCHED(5003, "Permissions fetched successfully"),

    // 6000 - Brand
    BRAND_CREATED(6000, "Brand created successfully"),
    BRAND_FETCHED(6001, "Brand fetched successfully"),
    BRAND_UPDATED(6002, "Brand updated successfully"),
    BRAND_DELETED(6003, "Brand deleted successfully"),
    BRANDS_FETCHED(6004, "Brands fetched successfully"),
    DELETED_BRANDS_FETCHED(6005, "Deleted brands fetched successfully"),
    BRAND_STATUS_UPDATED(6006, "Brand status updated successfully"),

    // 7000 - Category
    CATEGORY_CREATED(7000, "Category created successfully"),
    CATEGORY_FETCHED(7001, "Category fetched successfully"),
    CATEGORY_UPDATED(7002, "Category updated successfully"),
    CATEGORY_DELETED(7003, "Category deleted successfully"),
    CATEGORIES_FETCHED(7004, "Categories fetched successfully"),

    // 8000 - Coupon
    COUPON_CREATED(8000, "Coupon created successfully"),
    COUPON_FETCHED(8001, "Coupon fetched successfully"),
    COUPON_UPDATED(8002, "Coupon updated successfully"),
    COUPON_DELETED(8003, "Coupon deleted successfully"),
    COUPONS_FETCHED(8004, "Coupons fetched successfully"),
    DELETED_COUPONS_FETCHED(8005, "Deleted coupons fetched successfully"),
    COUPON_STATUS_UPDATED(8006, "Coupon status updated successfully"),
    COUPON_VALIDATED(8007, "Coupon validated successfully"),
    COUPON_APPLIED(8008, "Coupon applied successfully"),
    COUPON_RESTORED(8009, "Coupon restored successfully"),

    // 9000 - Address
    ADDRESS_CREATED(9000, "Address created successfully"),
    ADDRESS_FETCHED(9001, "Address fetched successfully"),
    ADDRESS_UPDATED(9002, "Address updated successfully"),
    ADDRESS_DELETED(9003, "Address deleted successfully"),
    ADDRESSES_FETCHED(9004, "Addresses fetched successfully"),
    ADDRESS_DEFAULT_UPDATED(9005, "Default address updated successfully"),

    // 10000 - Cart
    CART_CREATED(10000, "Cart created successfully"),
    CART_FETCHED(10001, "Cart fetched successfully"),
    CART_ITEM_ADDED(10002, "Cart item added successfully"),
    CART_ITEM_UPDATED(10003, "Cart item updated successfully"),
    CART_ITEM_INCREASED(10004, "Cart item quantity increased successfully"),
    CART_ITEM_DECREASED(10005, "Cart item quantity decreased successfully"),
    CART_ITEM_REMOVED(10006, "Cart item removed successfully"),
    CART_CLEARED(10007, "Cart cleared successfully"),

    // 11000 - Payment
    PAYMENT_METHODS_FETCHED(11000, "Payment methods fetched successfully"),

    // 12000 - Order & Checkout
    CHECKOUT_PREVIEW_CREATED(12000, "Checkout preview created successfully"),
    ORDER_CREATED(12001, "Order created successfully"),
    ORDER_FETCHED(12002, "Order fetched successfully"),
    ORDERS_FETCHED(12003, "Orders fetched successfully"),
    ORDER_CANCELLED(12004, "Order cancelled successfully"),
    ORDER_STATUS_UPDATED(12005, "Order status updated successfully"),
    ORDER_SHIPPING_STATUS_UPDATED(12006, "Order shipping status updated successfully"),
    ORDER_PAYMENT_STATUS_UPDATED(12007, "Order payment status updated successfully"),
    ORDER_STATUS_HISTORY_FETCHED(12008, "Order status history fetched successfully"),
    ORDER_CANCEL_REQUEST_CREATED(12009, "Order cancellation request created successfully"),
    ORDER_CANCEL_REQUESTS_FETCHED(12010, "Order cancellation requests fetched successfully"),
    ORDER_CANCEL_REQUEST_FETCHED(12011, "Order cancellation request fetched successfully"),
    ORDER_CANCEL_REQUEST_APPROVED(12012, "Order cancellation request approved successfully"),
    ORDER_CANCEL_REQUEST_REJECTED(12013, "Order cancellation request rejected successfully"),

    // 13000 - Product Review
    PRODUCT_REVIEW_CREATED(13000, "Product review created successfully"),
    PRODUCT_REVIEW_FETCHED(13001, "Product review fetched successfully"),
    PRODUCT_REVIEWS_FETCHED(13002, "Product reviews fetched successfully"),
    PRODUCT_REVIEW_UPDATED(13003, "Product review updated successfully"),
    PRODUCT_REVIEW_DELETED(13004, "Product review deleted successfully"),
    PRODUCT_REVIEW_STATUS_UPDATED(13005, "Product review status updated successfully"),
    PRODUCT_REVIEW_SUMMARY_FETCHED(13006, "Product review summary fetched successfully");

    private final int code;
    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
