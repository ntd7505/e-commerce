package com.NguyenDat.ecommerce.dto.response;

import com.NguyenDat.ecommerce.enums.SuccessCode;
import com.NguyenDat.ecommerce.exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseAPI<T> {
    int code;
    String message;
    T data;

    public static <T> ResponseAPI<T> success(SuccessCode successCode, T result) {
        return ResponseAPI.<T>builder()
                .code(successCode.getCode())
                .message(successCode.getMessage())
                .data(result)
                .build();
    }

    public static <T> ResponseAPI<T> error(ErrorCode er) {
        return ResponseAPI.<T>builder()
                .code(er.getCode())
                .message(er.getMessage())
                .build();
    }

}
