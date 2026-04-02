package com.backend.order_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.backend.order_service.dto.response.ErrorResponse;
import java.time.LocalDateTime;

import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.context.request.WebRequest;

import java.util.List;

@RestControllerAdvice
@Slf4j(topic = "GLOBAL-EXCEPTION")
public class GlobalHandlerException {
        // Xử lý các lỗi tùy chỉnh của ứng dụng
        @ExceptionHandler(AppException.class)
        public ResponseEntity<ErrorResponse> handleAppException(AppException ex, WebRequest request) {
                return ResponseEntity.status(ex.getErrorCode().getStatusCode())
                                .body(buildErrorResponse(ex.getErrorCode(), request));
        }

        // Xử lý lỗi validation dữ liệu đầu vào
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e,
                        WebRequest request) {
                List<String> errors = e.getBindingResult().getFieldErrors()
                                .stream()
                                .map(FieldError::getDefaultMessage)
                                .toList();

                ErrorResponse response = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .message(errors.size() > 1 ? errors.toString() : errors.get(0))
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();

                return ResponseEntity.badRequest().body(response);
        }

        // Xử lý lỗi thiếu header bắt buộc
        @ExceptionHandler(MissingRequestHeaderException.class)
        public ResponseEntity<ErrorResponse> handleMissingHeader(MissingRequestHeaderException ex, WebRequest request) {
                ErrorResponse response = ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .message("Header bắt buộc '" + ex.getHeaderName() + "' đang bị thiếu")
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();
                return ResponseEntity.badRequest().body(response);
        }

        // Xử lý tất cả các lỗi khác không lường trước
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex, WebRequest request) {
                log.error("Có lỗi không mong muốn xảy ra: ", ex);
                ErrorResponse response = buildErrorResponse(ErrorCode.INTERNAL_ERROR, request);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        // Helper: tạo ErrorResponse từ ErrorCode
        private ErrorResponse buildErrorResponse(ErrorCode errorCode, WebRequest request) {
                return ErrorResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .message(errorCode.getMessage())
                                .path(request.getDescription(false).replace("uri=", ""))
                                .build();
        }
}