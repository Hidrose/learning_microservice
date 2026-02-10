package com.backend.category_service.exception;

import org.springframework.http.HttpStatus;

// Xử lý lỗi của dịch vụ bên thứ 3
// Lỗi 500
public class ExternalServiceException extends BaseBusinessException {

    public ExternalServiceException(String message) {
        super(
                message,
                "ERR_EXTERNAL_SERVICE",
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
