package com.NguyenDat.ecommerce.exception;

import com.NguyenDat.ecommerce.dto.response.ResponseAPI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    ResponseEntity<ResponseAPI<?>> handlingAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ResponseAPI<?> responseAPI = new ResponseAPI<>();
        responseAPI.setCode(errorCode.getCode());
        responseAPI.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(responseAPI);

    }
}
