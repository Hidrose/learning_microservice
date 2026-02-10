package com.backend.brand_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.backend.brand_service.config.InternalFeignConfig;

@FeignClient(name = "product-service", configuration = InternalFeignConfig.class)
public interface ProductServiceClient {
    @GetMapping("/api/product/internal/exist/brand/{brandId}")
    Boolean existsProductByBrandIdInternal(@PathVariable String brandId);

    @PostMapping("/api/product/internal/status/brand/{brandId}")
    ResponseEntity<Void> hideProductsByBrandInternal(@PathVariable String brandId);
}
