package com.backend.assistant_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import com.backend.assistant_service.dto.response.ErrorResponse;
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