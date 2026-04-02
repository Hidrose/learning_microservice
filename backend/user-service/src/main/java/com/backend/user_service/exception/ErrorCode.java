package com.backend.user_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    INVALID_EMAIL("Email không hợp lệ", HttpStatus.BAD_REQUEST),
    INVALID_PHONE("Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED("Mật khẩu không được để trống", HttpStatus.BAD_REQUEST),

    USER_NOT_FOUND("Người dùng không tìm thấy", HttpStatus.NOT_FOUND),

    EMAIL_ALREADY_USED("Email đã được sử dụng", HttpStatus.CONFLICT),
    PHONE_ALREADY_USED("Số điện thoại đã được sử dụng", HttpStatus.CONFLICT);

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
