package com.NguyenDat.ecommerce.constant;

import lombok.Getter;

@Getter
public enum ResponseCode {
    // Common
    SUCCESS(1000, "Success"),
    NO_DATA_FOUND(1005, "No data found"),

    // User
    USER_CREATED(1100, "User created successfully"),
    USER_FETCHED(1101, "User fetched successfully"),
    USER_UPDATED(1102, "User updated successfully"),
    USER_DELETED(1103, "User deleted successfully"),
    USERS_FETCHED(1104, "Users fetched successfully"),

    // Auth
    LOGIN_SUCCESS(2000, "Login successfully"),
    LOGOUT_SUCCESS(2001, "Logout successfully"),

    // Product (thêm sau)
    PRODUCT_CREATED(3000, "Product created successfully"),

    // ROLE
    ROLE_FETCHED(2001, "Role fetched successfully");

    private final int code;
    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
