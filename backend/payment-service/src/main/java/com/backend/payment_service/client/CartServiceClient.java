package com.backend.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.backend.payment_service.config.InternalFeignConfig;

@FeignClient(name = "cart-service", configuration = InternalFeignConfig.class)
public interface CartServiceClient {
    @DeleteMapping("/api/cart/internal/clear/{userId}")
    ResponseEntity<Void> clearCartInternal(@PathVariable String userId);
}
