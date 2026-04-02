package com.backend.payment_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    PAYMENT_NOT_FOUND("Giao dịch thanh toán không tìm thấy", HttpStatus.NOT_FOUND),
    PAYMENT_ORDER_NOT_FOUND("Không tìm thấy giao dịch của đơn hàng", HttpStatus.NOT_FOUND),

    MOMO_REFUND_FAILED("Hoàn tiền Momo thất bại", HttpStatus.BAD_GATEWAY),
    ORDER_NOT_FOUND("Đơn hàng không tìm thấy", HttpStatus.NOT_FOUND),
    ;

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
