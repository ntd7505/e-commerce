package com.NguyenDat.ecommerce.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import jakarta.validation.ConstraintViolation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.NguyenDat.ecommerce.dto.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<?>> handlingException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.of(ErrorCode.UNCATEGORIZED_EXCEPTION));
    }

    @ExceptionHandler(AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        return ResponseEntity.status(errorCode.getStatusCode()).body(ApiResponse.of(errorCode));
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handlingAccessDeniedException(AccessDeniedException ex) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        log.error("AccessDeniedException: {}", ex.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(ApiResponse.of(errorCode));
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            String enumKey = fieldError.getDefaultMessage();
            String message;

            try {
                ErrorCode errorCode = ErrorCode.valueOf(enumKey);
                Map<String, Object> attributes = null;
                try {
                    var constraintViolation = fieldError.unwrap(ConstraintViolation.class);
                    attributes = constraintViolation.getConstraintDescriptor().getAttributes();
                } catch (Exception e) {

                }
                message = Objects.nonNull(attributes)
                        ? mapAttribute(errorCode.getMessage(), attributes)
                        : errorCode.getMessage();

            } catch (IllegalArgumentException e) {
                message = enumKey;
            }

            errors.put(fieldError.getField(), message);
        });

        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.<Map<String, String>>builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .data(errors)
                        .build());
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }
}
