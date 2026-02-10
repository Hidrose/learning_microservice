package com.backend.category_service.mapper;

import com.backend.category_service.dto.request.CategoryRequest;
import com.backend.category_service.dto.response.CategoryResponse;
import com.backend.category_service.entity.Category;

public class CategoryMapper {

    private CategoryMapper() {
    }

    public static Category toEntity(CategoryRequest request) {
        if (request == null) {
            return null;
        }

        return Category.builder()
                .name(request.getName())
                .status(request.getStatus())
                .build();
    }

    public static CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .image(category.getImage())
                .status(category.getStatus())
                .build();
    }

    public static void updateEntity(Category category, CategoryRequest request) {
        category.setName(request.getName());
        category.setStatus(request.getStatus());
    }
}
