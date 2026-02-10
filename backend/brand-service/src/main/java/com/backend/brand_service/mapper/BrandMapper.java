package com.backend.brand_service.mapper;

import com.backend.brand_service.dto.request.BrandRequest;
import com.backend.brand_service.dto.response.BrandResponse;
import com.backend.brand_service.entity.Brand;

public class BrandMapper {
    private BrandMapper() {
    }

    public static Brand toEntity(BrandRequest request) {
        if (request == null)
            return null;

        return Brand.builder()
                .name(request.getName())
                .status(request.getStatus())
                .build();
    }

    public static BrandResponse toResponse(Brand brand) {
        if (brand == null)
            return null;

        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .status(brand.getStatus())
                .build();
    }

    public static void updateEntity(Brand brand, BrandRequest request) {
        brand.setName(request.getName());
        brand.setStatus(request.getStatus());
    }
}
