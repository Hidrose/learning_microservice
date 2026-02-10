package com.backend.product_service.mapper;

import com.backend.product_service.dto.request.ImageProductRequest;
import com.backend.product_service.dto.response.ImageProductResponse;
import com.backend.product_service.entity.ImageProduct;

public final class ImageProductMapper {

    private ImageProductMapper() {
    }

    public static ImageProduct toEntity(ImageProductRequest request) {
        if (request == null)
            return null;

        return ImageProduct.builder()
                .image(request.getImage())
                .build();
    }

    public static ImageProductResponse toResponse(ImageProduct image) {
        if (image == null)
            return null;

        return ImageProductResponse.builder()
                .id(image.getId())
                .image(image.getImage())
                .build();
    }
}
