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
    USER_LOCKED(1005, "User account is locked", HttpStatus.FORBIDDEN),

    // 1100 - Validation
    INVALID_EMAIL(1100, "Email is invalid", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_FORMAT(
            1101,
            "Password must contain at least {min} characters, including uppercase, number, and special character.",
            HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1102, "Phone number must be exactly 10 digits.", HttpStatus.BAD_REQUEST),
    INVALID_FULL_NAME(1103, "Full name must be at least {min} characters", HttpStatus.BAD_REQUEST),
    FIELD_REQUIRED(1104, "This field is required", HttpStatus.BAD_REQUEST),

    // 2000 - Role & Permission
    ROLE_NOT_FOUND(2000, "Role not found", HttpStatus.NOT_FOUND),
    ROLE_EXISTED(2001, "Role already existed", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(2002, "Permission not found", HttpStatus.NOT_FOUND),

    // 3000 - Auth & JWT
    UNAUTHENTICATED(3000, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(3001, "You do not have permission", HttpStatus.FORBIDDEN),
    TOKEN_INVALID(3002, "Token is invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(3003, "Token has expired", HttpStatus.UNAUTHORIZED),
    TOKEN_BLACKLISTED(3004, "Token has been logged out", HttpStatus.UNAUTHORIZED);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
