package com.backend.payment_service.exception;

import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import com.backend.payment_service.dto.response.ErrorResponse;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // Lỗi nghiệp vụ
        @ExceptionHandler(BaseBusinessException.class)
        public ResponseEntity<ErrorResponse> handleBusinessException(
                        BaseBusinessException ex) {
                return ResponseEntity.status(ex.getHttpStatus()).body(
                                ErrorResponse.builder()
                                                .message(ex.getMessage())
                                                .errorCode(ex.getErrorCode())
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // Lỗi validation dữ liệu đầu vào
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
                String message = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .findFirst()
                                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                                .orElse("Dữ liệu đầu vào không hợp lệ");

                return ResponseEntity
                                .badRequest()
                                .body(
                                                ErrorResponse.builder()
                                                                .message(message)
                                                                .errorCode("ERR_VALIDATION")
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }

        // Lỗi về database
        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
                String message = "Lỗi dữ liệu database";
                String errorCode = "ERR_DB_GENERIC";
                HttpStatus status = HttpStatus.CONFLICT;

                if (ex.getMostSpecificCause() != null) {
                        String cause = ex.getMostSpecificCause().getMessage();
                        if (cause.contains("Duplicate")) {
                                message = "Dữ liệu đã tồn tại";
                                errorCode = "ERR_DUPLICATE";
                        } else if (cause.contains("foreign key")) {
                                message = "Dữ liệu đang được liên kết";
                                errorCode = "ERR_FOREIGN_KEY";
                                status = HttpStatus.BAD_REQUEST;
                        }
                }

                return ResponseEntity
                                .status(status)
                                .body(
                                                ErrorResponse.builder()
                                                                .message(message)
                                                                .errorCode(errorCode)
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }

        @ExceptionHandler(DataAccessResourceFailureException.class)
        public ResponseEntity<ErrorResponse> handleDBConnectionError() {
                return ResponseEntity
                                .status(HttpStatus.SERVICE_UNAVAILABLE)
                                .body(
                                                ErrorResponse.builder()
                                                                .message("Không thể kết nối đến Database. Vui lòng thử lại sau.")
                                                                .errorCode("ERR_DB_CONNECTION")
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }

        // Lỗi gửi JSON sai định dạng
        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ErrorResponse> handleJsonParseError() {
                return ResponseEntity
                                .badRequest()
                                .body(
                                                ErrorResponse.builder()
                                                                .message("JSON Body không đúng định dạng")
                                                                .errorCode("ERR_JSON_PARSE")
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }

        // Lỗi sai kiểu dữ liệu trên URL
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
                return ResponseEntity
                                .badRequest()
                                .body(
                                                ErrorResponse.builder()
                                                                .message("Tham số '" + ex.getName()
                                                                                + "' sai kiểu dữ liệu")
                                                                .errorCode("ERR_TYPE_MISMATCH")
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }

        // Lỗi sai Method HTTP
        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
                return ResponseEntity
                                .status(HttpStatus.METHOD_NOT_ALLOWED)
                                .body(
                                                ErrorResponse.builder()
                                                                .message("Method " + ex.getMethod()
                                                                                + " không được hỗ trợ")
                                                                .errorCode("ERR_METHOD_NOT_SUPPORTED")
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }

        // Lỗi khác không lường trước
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
                ex.printStackTrace();
                return ResponseEntity
                                .internalServerError()
                                .body(
                                                ErrorResponse.builder()
                                                                .message("Lỗi hệ thống không mong muốn " + ex)
                                                                .errorCode("ERR_INTERNAL_SERVER")
                                                                .timestamp(LocalDateTime.now())
                                                                .build());
        }
}