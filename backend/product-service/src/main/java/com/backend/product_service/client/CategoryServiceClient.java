package com.backend.product_service.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.backend.product_service.config.InternalFeignConfig;
import com.backend.product_service.dto.response.CategoryResponse;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@FeignClient(name = "category-service", configuration = InternalFeignConfig.class)
public interface CategoryServiceClient {

    @GetMapping("/api/category/internal/{id}")
    CategoryResponse getCategoryByIdInternal(@PathVariable String id);

    @PostMapping("/api/category/internal/categories")
    Map<String, CategoryResponse> getCategoriesByIdsInternal(@RequestBody List<String> ids);

    @GetMapping("/api/category/internal/slug/{slug}")
    CategoryResponse getCategoryBySlugInternal(@PathVariable String slug);
}
