package com.backend.product_service.mapper;

import com.backend.product_service.dto.request.SpecificationRequest;
import com.backend.product_service.dto.response.SpecificationResponse;
import com.backend.product_service.entity.Specification;

public final class SpecificationMapper {

    private SpecificationMapper() {
    }

    public static Specification toEntity(SpecificationRequest request) {
        if (request == null)
            return null;

        return Specification.builder()
                .specKey(request.getSpecKey())
                .specValue(request.getSpecValue())
                .displayOrder(request.getDisplayOrder())
                .build();
    }

    public static SpecificationResponse toResponse(Specification spec) {
        if (spec == null)
            return null;

        return SpecificationResponse.builder()
                .id(spec.getId())
                .specKey(spec.getSpecKey())
                .specValue(spec.getSpecValue())
                .displayOrder(spec.getDisplayOrder())
                .build();
    }
}
