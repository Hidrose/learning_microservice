package com.backend.cart_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    CART_ITEM_NOT_FOUND("Sản phẩm không có trong giỏ hàng", HttpStatus.NOT_FOUND),
    CART_EMPTY("Giỏ hàng trống", HttpStatus.BAD_REQUEST),

    PRODUCT_NOT_FOUND("Sản phẩm không tồn tại", HttpStatus.NOT_FOUND),

    INVALID_QUANTITY("Số lượng phải lớn hơn hoặc bằng 1", HttpStatus.BAD_REQUEST),
    ;

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
