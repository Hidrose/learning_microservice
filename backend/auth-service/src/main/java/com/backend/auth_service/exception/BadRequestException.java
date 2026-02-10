package com.backend.auth_service.exception;

import org.springframework.http.HttpStatus;

// Xử lý lỗi vè Validate input, query param, file upload
// Lỗi 400
public class BadRequestException extends BaseBusinessException {
    public BadRequestException(String message) {
        super(message, "ERR_BAD_REQUEST", HttpStatus.BAD_REQUEST);
    }
}
