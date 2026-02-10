package com.backend.chat_service.exception;

import com.backend.chat_service.dto.response.ErrorResponse;
import com.mongodb.DuplicateKeyException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
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

        // Lỗi validation
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {

                String message = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .findFirst()
                                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                                .orElse("Dữ liệu đầu vào không hợp lệ");

                return ResponseEntity.badRequest().body(
                                ErrorResponse.builder()
                                                .message(message)
                                                .errorCode("ERR_VALIDATION")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // Lỗi trùng dữ liệu
        @ExceptionHandler(DuplicateKeyException.class)
        public ResponseEntity<ErrorResponse> handleDuplicateKeyException(DuplicateKeyException ex) {

                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                ErrorResponse.builder()
                                                .message("Dữ liệu đã tồn tại")
                                                .errorCode("ERR_DUPLICATE")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // Lỗi kết nối DB
        @ExceptionHandler(DataAccessResourceFailureException.class)
        public ResponseEntity<ErrorResponse> handleDBConnectionError(DataAccessResourceFailureException ex) {

                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                                ErrorResponse.builder()
                                                .message("Không thể kết nối đến Database. Vui lòng thử lại sau.")
                                                .errorCode("ERR_DB_CONNECTION")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // JSON sai format
        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ErrorResponse> handleJsonParseError(HttpMessageNotReadableException ex) {

                return ResponseEntity.badRequest().body(
                                ErrorResponse.builder()
                                                .message("JSON Body không đúng định dạng hoặc bị lỗi cú pháp")
                                                .errorCode("ERR_JSON_PARSE")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // Sai kiểu dữ liệu param
        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {

                return ResponseEntity.badRequest().body(
                                ErrorResponse.builder()
                                                .message(
                                                                "Tham số '" + ex.getName()
                                                                                + "' sai kiểu dữ liệu. Yêu cầu: "
                                                                                + ex.getRequiredType().getSimpleName())
                                                .errorCode("ERR_TYPE_MISMATCH")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // Sai HTTP Method
        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {

                return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(
                                ErrorResponse.builder()
                                                .message("Method " + ex.getMethod()
                                                                + " không được hỗ trợ tại endpoint này")
                                                .errorCode("ERR_METHOD_NOT_SUPPORTED")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }

        // Lỗi không lường trước
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {

                ex.printStackTrace();

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                                ErrorResponse.builder()
                                                .message("Lỗi hệ thống không mong muốn " + ex)
                                                .errorCode("ERR_INTERNAL_SERVER")
                                                .timestamp(LocalDateTime.now())
                                                .build());
        }
}
