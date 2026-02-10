package com.backend.product_service.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseBusinessException {

    public NotFoundException(String message) {
        super(
                message,
                "ERR_NOT_FOUND",
                HttpStatus.NOT_FOUND);
    }
}
