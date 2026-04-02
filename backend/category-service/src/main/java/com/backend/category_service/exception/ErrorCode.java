package com.backend.category_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    CATEGORY_NOT_FOUND("Danh mục không tìm thấy", HttpStatus.NOT_FOUND),
    CATEGORY_NAME_EXISTS("Tên danh mục đã được sử dụng", HttpStatus.CONFLICT),
    CATEGORY_IN_USE("Danh mục này không thể xóa vì đang được sử dụng bởi sản phẩm", HttpStatus.CONFLICT),

    IMAGE_REQUIRED("Hình ảnh không được để trống", HttpStatus.BAD_REQUEST),
    IMAGE_TOO_LARGE("Dung lượng hình tối đa 2MB", HttpStatus.BAD_REQUEST),
    IMAGE_INVALID_TYPE("Hình chỉ cho phép JPG, PNG, WEBP, SVG", HttpStatus.BAD_REQUEST),
    IMAGE_UPLOAD_FAILED("Tải hình lên thất bại", HttpStatus.BAD_GATEWAY),
    IMAGE_DELETE_FAILED("Xóa hình thất bại", HttpStatus.BAD_GATEWAY);

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
