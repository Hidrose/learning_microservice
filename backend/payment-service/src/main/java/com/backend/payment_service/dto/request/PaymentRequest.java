package com.backend.payment_service.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    @NotBlank(message = "Order id không được để trống")
    private String orderId;

    @NotBlank(message = "Order code không được để trống")
    private String orderCode;

    @NotBlank(message = "Cổng thanh toán không được để trống")
    private String paymethod;

    @NotNull(message = "Tổng số tiền không được để trống")
    @Min(value = 10000, message = "Tổng số tiền >= 10000")
    private BigDecimal amount;

    @NotBlank(message = "Mã giao dịch không được để trống")
    private String transactionId;

    @NotBlank(message = "Tình trạng không được để trống")
    private Integer status;
}
