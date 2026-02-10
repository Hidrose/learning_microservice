package com.backend.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.backend.order_service.config.InternalFeignConfig;

@FeignClient(name = "payment-service", configuration = InternalFeignConfig.class)
public interface PaymentServiceClient {
    @PostMapping("/api/payment/internal/momo/refund/{orderCode}")
    ResponseEntity<Void> refundMomoByOrderCodeInternal(@PathVariable String orderCode);
}
