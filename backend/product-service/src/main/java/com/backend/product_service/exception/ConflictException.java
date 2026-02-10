package com.backend.product_service.exception;

import org.springframework.http.HttpStatus;

// Xử lý lỗi xung đột với trạng thái hiện tại của hệ thống như trùng dữ liệu, không thể xóa
public class ConflictException extends BaseBusinessException {

    public ConflictException(String message) {
        super(
                message,
                "ERR_CONFLICT",
                HttpStatus.CONFLICT);
    }
}
