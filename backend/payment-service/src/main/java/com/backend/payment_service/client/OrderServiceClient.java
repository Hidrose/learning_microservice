package com.backend.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.payment_service.config.InternalFeignConfig;
import com.backend.payment_service.dto.response.OrderResponse;

@FeignClient(name = "order-service", configuration = InternalFeignConfig.class)
public interface OrderServiceClient {
    @GetMapping("/api/order/internal/code/{orderCode}")
    OrderResponse getOrderByOrderCodeInternal(@PathVariable String orderCode);

    @PatchMapping("/api/order/internal/status/{id}")
    void updateOrderStatusInternal(
            @PathVariable String id,
            @RequestParam Integer status);

    @DeleteMapping("/api/order/internal/{orderCode}")
    ResponseEntity<Void> deleteOrderByCodeInternal(@PathVariable String orderCode);

    @PostMapping("/api/order/internal/payment/{orderCode}")
    ResponseEntity<Void> confirmGatewayPaymentInternal(@PathVariable String orderCode);
}
