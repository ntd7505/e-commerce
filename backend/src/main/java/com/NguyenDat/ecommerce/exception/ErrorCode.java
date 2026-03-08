package com.NguyenDat.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // 9999 - System
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    // 1000 - User
    USER_NOT_EXISTED(1000, "User not found", HttpStatus.NOT_FOUND),
    USER_EXISTED(1001, "User already existed", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1002, "Email already existed", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1003, "Phone number already existed", HttpStatus.BAD_REQUEST),
    USER_INACTIVE(1004, "User account is inactive", HttpStatus.FORBIDDEN),
    USER_LOCKED(1005, "User account is locked", HttpStatus.FORBIDDEN),

    // 2000 - Role & Permission
    ROLE_NOT_FOUND(2000, "Role not found", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_FOUND(2001, "Permission not found", HttpStatus.NOT_FOUND),

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
