package com.backend.payment_service.dto.response;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private String id;
    private String productId;
    private String name;
    private List<String> images;
    private int quantity;
    private BigDecimal price;
    private BigDecimal discount;
}
