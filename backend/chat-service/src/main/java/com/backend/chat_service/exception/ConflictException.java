package com.backend.chat_service.exception;

import org.springframework.http.HttpStatus;

// Xử lý lỗi xung đột với trạng thái hiện tại của hệ thống như trùng dữ liệu, không thể xóa 
// Lỗi 409
public class ConflictException extends BaseBusinessException {

    public ConflictException(String message) {
        super(
                message,
                "ERR_CONFLICT",
                HttpStatus.CONFLICT);
    }
}
