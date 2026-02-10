package com.backend.payment_service.mapper;

import com.backend.payment_service.dto.request.PaymentRequest;
import com.backend.payment_service.dto.response.PaymentResponse;
import com.backend.payment_service.entity.Payment;

public final class PaymentMapper {

    private PaymentMapper() {
    }

    public static Payment toEntity(PaymentRequest request) {
        return Payment.builder()
                .orderId(request.getOrderId())
                .orderCode(request.getOrderCode())
                .paymethod(request.getPaymethod())
                .amount(request.getAmount())
                .transactionId(request.getTransactionId())
                .status(request.getStatus())
                .build();
    }

    public static PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .orderCode(payment.getOrderCode())
                .paymethod(payment.getPaymethod())
                .amount(payment.getAmount())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
