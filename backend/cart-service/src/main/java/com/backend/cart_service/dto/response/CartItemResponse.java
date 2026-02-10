package com.backend.cart_service.dto.response;

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
public class CartItemResponse {
    private String productId;
    private String name;
    private List<String> images;
    private BigDecimal price;
    private BigDecimal discount;
    private String slug;
    private int quantity;
    private int stock;
    private int status;
}
