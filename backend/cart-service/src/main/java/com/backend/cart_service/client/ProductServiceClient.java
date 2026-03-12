package com.backend.cart_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.backend.cart_service.dto.response.ProductResponse;

@FeignClient(name = "product-service")
public interface ProductServiceClient {
    @PostMapping("/api/product/internal/products")
    List<ProductResponse> getProductsByIdsInternal(@RequestBody List<String> ids);
}