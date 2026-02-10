package com.backend.auth_service.exception;

import org.springframework.http.HttpStatus;

// Lỗi 404
public class NotFoundException extends BaseBusinessException {

    public NotFoundException(String message) {
        super(
                message,
                "ERR_NOT_FOUND",
                HttpStatus.NOT_FOUND);
    }
}
