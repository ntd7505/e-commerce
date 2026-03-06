package com.NguyenDat.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized of", HttpStatus.INTERNAL_SERVER_ERROR),
    // ✅ 5000 - User
    USER_NOT_EXISTED(5000, "User not found", HttpStatus.BAD_REQUEST),
    USER_EXISTED(5001, "User already existed", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(5002, "Email already existed", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(5003, "Phone number already existed", HttpStatus.BAD_REQUEST),
    USER_INACTIVE(5004, "User account is inactive", HttpStatus.BAD_REQUEST),
    USER_LOCKED(5005, "User account is locked", HttpStatus.BAD_REQUEST),
    ROLE_NOT_FOUND(5006, "Role not found", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
