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

    // 2000 - Auth
    LOGIN_SUCCESS(2000, "Login successfully"),
    LOGOUT_SUCCESS(2001, "Logout successfully"),
    REFRESH_TOKEN_SUCCESS(2002, "Refresh token successfully"),
    INTROSPECT_SUCCESS(2003, "Introspect successfully"),

    // 3000 - Product
    PRODUCT_CREATED(3000, "Product created successfully"),
    PRODUCT_FETCHED(3001, "Product fetched successfully"),
    PRODUCT_UPDATED(3002, "Product updated successfully"),
    PRODUCT_DELETED(3003, "Product deleted successfully"),
    PRODUCTS_FETCHED(3004, "Products fetched successfully"),
    PRODUCT_VARIANT_FETCHED(3005, "Product variant fetched successfully"),
    PRODUCT_VARIANT_DELETED(3006, "Product variant deleted successfully"),

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

    // 7000 - Category
    CATEGORY_CREATED(7000, "Category created successfully"),
    CATEGORY_FETCHED(7001, "Category fetched successfully"),
    CATEGORY_UPDATED(7002, "Category updated successfully"),
    CATEGORY_DELETED(7003, "Category deleted successfully"),
    CATEGORIES_FETCHED(7004, "Categories fetched successfully");

    private final int code;
    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
