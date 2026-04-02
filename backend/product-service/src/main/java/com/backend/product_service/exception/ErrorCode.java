package com.backend.product_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi chưa phân loại", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),

    // Product
    PRODUCT_NOT_FOUND("Sản phẩm không tìm thấy", HttpStatus.NOT_FOUND),
    PRODUCT_NAME_EXISTED("Tên sản phẩm đã được sử dụng", HttpStatus.CONFLICT),
    PRODUCT_IN_ORDER("Sản phẩm này không thể xóa vì đã tồn tại trong đơn hàng", HttpStatus.CONFLICT),
    PRODUCT_OUT_OF_STOCK("Sản phẩm không đủ tồn kho", HttpStatus.BAD_REQUEST),
    INVALID_PRICE("Giá bán phải lớn hơn 0", HttpStatus.BAD_REQUEST),
    DISCOUNT_NEGATIVE("Số tiền giảm giá không được nhỏ hơn 0", HttpStatus.BAD_REQUEST),
    DISCOUNT_EXCEEDS_PRICE("Số tiền giảm giá phải nhỏ hơn giá bán", HttpStatus.BAD_REQUEST),
    DISCOUNT_TOO_SMALL("Phần trăm giảm giá phải lớn hoặc bằng 1%", HttpStatus.BAD_REQUEST),
    INVALID_STOCK("Số lượng tồn kho phải lớn hơn hoặc bằng 0", HttpStatus.BAD_REQUEST),
    PRODUCT_IMAGE_REQUIRED("Vui lòng thêm ít nhất một hình sản phẩm", HttpStatus.BAD_REQUEST),
    SPECIFICATION_REQUIRED("Vui lòng thêm ít nhất một thông tin chi tiết", HttpStatus.BAD_REQUEST),

    // Image
    IMAGE_NOT_FOUND("Hình không tìm thấy", HttpStatus.NOT_FOUND),
    IMAGE_NOT_BELONG_TO_PRODUCT("Hình không thuộc sản phẩm", HttpStatus.BAD_REQUEST),
    IMAGE_EMPTY("File hình không được để trống", HttpStatus.BAD_REQUEST),
    IMAGE_SIZE_EXCEEDED("Dung lượng hình tối đa 2MB", HttpStatus.BAD_REQUEST),
    IMAGE_TYPE_INVALID("Hình chỉ cho phép JPG, PNG, WEBP", HttpStatus.BAD_REQUEST),
    IMAGE_UPLOAD_FAILED("Tải hình lên thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
    IMAGE_DELETE_FAILED("Xóa hình thất bại", HttpStatus.INTERNAL_SERVER_ERROR),

    // Specification
    SPECIFICATION_NOT_FOUND("Thông số không tìm thấy", HttpStatus.NOT_FOUND),
    SPECIFICATION_NOT_BELONG_TO_PRODUCT("Thông số không thuộc sản phẩm", HttpStatus.BAD_REQUEST),

    // Category
    CATEGORY_NOT_FOUND("Danh mục không tìm thấy", HttpStatus.NOT_FOUND),
    CATEGORY_INACTIVE_CANNOT_ACTIVATE_PRODUCT("Danh mục đang bị ẩn, không thể kích hoạt sản phẩm",
            HttpStatus.BAD_REQUEST),

    // Brand
    BRAND_NOT_FOUND("Thương hiệu không tìm thấy", HttpStatus.NOT_FOUND),
    BRAND_INACTIVE_CANNOT_ACTIVATE_PRODUCT("Thương hiệu đang bị ẩn, không thể kích hoạt sản phẩm",
            HttpStatus.BAD_REQUEST),
            ;

    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(String message, HttpStatus statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
