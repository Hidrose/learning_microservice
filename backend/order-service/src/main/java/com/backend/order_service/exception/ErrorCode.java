package com.backend.order_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    ORDER_NOT_FOUND("Đơn hàng không tìm thấy", HttpStatus.NOT_FOUND),
    ORDER_NOT_BELONG_TO_USER("Đơn hàng không tồn tại hoặc không thuộc về bạn", HttpStatus.NOT_FOUND),
    ORDER_RETURN_NOT_ALLOWED("Chỉ có thể trả hàng khi đơn đã giao thành công", HttpStatus.BAD_REQUEST),

    INVALID_PHONE("Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
    ;

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
