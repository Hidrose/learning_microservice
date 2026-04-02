package com.backend.auth_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    INVALID_EMAIL("Email không hợp lệ", HttpStatus.BAD_REQUEST),
    OTP_EMAIL_MISMATCH("OTP và email đăng ký không khớp", HttpStatus.BAD_REQUEST),
    OTP_NOT_FOUND("OTP không tồn tại", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED("OTP đã hết hạn", HttpStatus.BAD_REQUEST),
    OTP_INCORRECT("OTP không đúng", HttpStatus.BAD_REQUEST),
    OTP_TOO_MANY_ATTEMPTS("Bạn đã nhập sai OTP quá 5 lần. Vui lòng gửi lại mã mới", HttpStatus.BAD_REQUEST),
    WAIT_BEFORE_RESEND_OTP("Vui lòng đợi 5 phút trước khi gửi lại OTP", HttpStatus.BAD_REQUEST),

    EMAIL_ALREADY_USED("Email đã được sử dụng", HttpStatus.CONFLICT),
    LOGIN_FAILED("Email hoặc mật khẩu không đúng", HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN),

    OTP_SEND_FAILED("Không thể gửi OTP đến email", HttpStatus.INTERNAL_SERVER_ERROR),
    OTP_SEND_SELF_EMAIL("Không thể gửi OTP đến email này", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}