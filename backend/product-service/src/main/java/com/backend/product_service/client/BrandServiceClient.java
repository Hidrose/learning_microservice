package com.backend.product_service.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.backend.product_service.dto.response.BrandResponse;

@FeignClient(name = "brand-service")
public interface BrandServiceClient {

    @GetMapping("/api/brand/internal/{id}")
    BrandResponse getBrandByIdInternal(@PathVariable String id);

    @PostMapping("/api/brand/internal/brands")
    Map<String, BrandResponse> getBrandsByIdsInternal(@RequestBody List<String> ids);

    @GetMapping("/api/brand/internal/slug/{slug}")
    BrandResponse getBrandBySlugInternal(@PathVariable String slug);
}
