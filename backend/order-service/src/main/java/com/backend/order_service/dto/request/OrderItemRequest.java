package com.backend.order_service.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemRequest {
    @NotBlank(message = "ProductId không được để trống")
    private String productId;

    @Min(value = 1, message = "Số lượng phải >= 1")
    private int quantity;

    @Positive(message = "Giá phải > 0")
    private BigDecimal price;

    @Min(value = 0, message = "Giảm giá không hợp lệ")
    private BigDecimal discount;
}
