package com.NguyenDat.ecommerce.common.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import jakarta.validation.ConstraintViolation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.NguyenDat.ecommerce.common.dto.response.ApiResponse;
import com.NguyenDat.ecommerce.modules.user.enums.Active;

import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<?>> handlingException(Exception ex) {
        log.error("Unhandled exception", ex);
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
        log.warn("Access denied: {}", ex.getMessage());
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
                    log.debug("Cannot unwrap ConstraintViolation for field {}", fieldError.getField(), e);
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

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse<?>> handlingHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException invalidFormatException
                && invalidFormatException.getTargetType() == Active.class) {
            ErrorCode errorCode = ErrorCode.INVALID_KEY;
            Map<String, String> errors = Map.of("status", ErrorCode.INVALID_USER_STATUS.getMessage());
            return ResponseEntity.status(errorCode.getStatusCode())
                    .body(ApiResponse.<Map<String, String>>builder()
                            .code(errorCode.getCode())
                            .message(errorCode.getMessage())
                            .data(errors)
                            .build());
        }

        return ResponseEntity.status(ErrorCode.INVALID_KEY.getStatusCode()).body(ApiResponse.of(ErrorCode.INVALID_KEY));
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }
}
