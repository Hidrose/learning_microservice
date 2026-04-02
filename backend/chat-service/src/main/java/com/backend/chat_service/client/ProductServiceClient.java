package com.backend.chat_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.backend.chat_service.dto.response.ProductListItemResponse;

@FeignClient(name = "product-service")
public interface ProductServiceClient {
    @PostMapping("/api/product/internal/products")
    List<ProductListItemResponse> getProductsByIdsInternal(@RequestBody List<String> ids);
}
