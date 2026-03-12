package com.backend.product_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cart-service")
public interface CartServiceClient {
    @DeleteMapping("/api/cart/internal/all/{productId}")
    ResponseEntity<Void> removeProductFromAllCartsInternal(@PathVariable String productId);
}
