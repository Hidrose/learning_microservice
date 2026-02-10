package com.backend.payment_service.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private String id;
    private String orderId;
    private String orderCode;
    private String paymethod;
    private BigDecimal amount;
    private String transactionId;
    private Integer status;
    private LocalDateTime createdAt;
}
