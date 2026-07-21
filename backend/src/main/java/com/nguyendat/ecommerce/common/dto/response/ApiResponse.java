package com.nguyendat.ecommerce.common.dto.response;

import java.time.LocalDateTime;
import java.util.Collection;

import com.nguyendat.ecommerce.common.constant.ResponseCode;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    boolean success = true;

    int code;
    String message;
    T data;
    ApiError error;

    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh"));

    public static <T> ApiResponse<T> of(ResponseCode responseCode, T result) {
        return ApiResponse.<T>builder()
                .success(true)
                .code(responseCode.getCode())
                .message(responseCode.getMessage())
                .data(result)
                .build();
    }

    public static <T> ApiResponse<T> of(ErrorCode er) {
        return error(er, null);
    }

    public static <T> ApiResponse<T> error(ErrorCode er, Object details) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(er.getCode())
                .message(er.getMessage())
                .error(ApiError.builder()
                        .code(er.name())
                        .message(er.getMessage())
                        .details(details)
                        .build())
                .build();
    }

    public static <T extends Collection<?>> ApiResponse<T> ofList(ResponseCode responseCode, T data) {

        if (data.isEmpty()) {
            return ApiResponse.<T>builder()
                    .success(true)
                    .code(ResponseCode.NO_DATA_FOUND.getCode())
                    .message(ResponseCode.NO_DATA_FOUND.getMessage())
                    .data(data)
                    .build();
        }

        return ApiResponse.<T>builder()
                .success(true)
                .code(responseCode.getCode())
                .message(responseCode.getMessage())
                .data(data)
                .build();
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ApiError {
        String code;
        String message;
        Object details;
    }
}

