package com.backend.category_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.backend.category_service.config.InternalFeignConfig;

@FeignClient(name = "product-service", configuration = InternalFeignConfig.class)
public interface ProductServiceClient {
    @GetMapping("/api/product/internal/exist/category/{categoryId}")
    Boolean existsProductByCategoryIdInternal(@PathVariable String categoryId);

    @PostMapping("/api/product/internal/status/category/{categoryId}")
    ResponseEntity<Void> hideProductsByCategoryInternal(@PathVariable String categoryId);
}
