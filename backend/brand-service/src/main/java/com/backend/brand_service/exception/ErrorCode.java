package com.backend.brand_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    BRAND_NOT_FOUND("Thương hiệu không tìm thấy", HttpStatus.NOT_FOUND),
    BRAND_NAME_EXISTS("Tên thương hiệu đã được sử dụng", HttpStatus.CONFLICT),
    BRAND_IN_USE("Thương hiệu này không thể xóa vì đang được sử dụng bởi sản phẩm", HttpStatus.CONFLICT),
    ;

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
