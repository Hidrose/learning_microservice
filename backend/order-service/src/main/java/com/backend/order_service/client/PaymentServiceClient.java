package com.backend.order_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "payment-service")
public interface PaymentServiceClient {
    @PostMapping("/api/payment/internal/momo/refund/{orderCode}")
    ResponseEntity<Void> refundMomoByOrderCodeInternal(@PathVariable String orderCode);
}
