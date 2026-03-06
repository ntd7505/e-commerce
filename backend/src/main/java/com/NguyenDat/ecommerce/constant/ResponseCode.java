package com.NguyenDat.ecommerce.constant;

import lombok.Getter;

@Getter
public enum SuccessCode {
    // User
    USER_CREATED(1000, "User created successfully"),
    USER_FETCHED(1001, "User fetched successfully"),
    USER_UPDATED(1002, "User updated successfully"),
    USER_DELETED(1003, "User deleted successfully"),
    USERS_FETCHED(1004, "Users fetched successfully"),

    // Auth
    LOGIN_SUCCESS(2000, "Login successfully"),
    LOGOUT_SUCCESS(2001, "Logout successfully"),

    // Product (thêm sau)
    PRODUCT_CREATED(3000, "Product created successfully"),

    // ROLE
    ROLE_FETCHED(2001, "Role fetched successfully");

    private final int code;
    private final String message;

    SuccessCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
